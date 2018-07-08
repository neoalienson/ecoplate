#!/usr/bin/env python
import PCF8591 as ADC
import smbus
import time
import firebase_admin
from firebase_admin import credentials
from google.cloud import firestore
from google.cloud import exceptions as googleExceptions

cred = credentials.Certificate("/home/pi/AngelHack/SunFounder_SensorKit_for_RPi2/Python/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.Client()
order_ref = db.collection(u'done_orders')
weightError = 1

def setup():
	ADC.setup(0x48)

def scanIfOrderAssociated():
	try:
		orderItems = order_ref.get()
		for docs in orderItems:
			print(u'Document data: {}'.format(docs.to_dict()))
			try:
				initWeight = ADC.read(1)
				dishNotServed = True
				while dishNotServed:
					currentWeight = ADC.read(1)
					if currentWeight > (initWeight + 4):
						dishNotServed = False
					else:
						print(u'Waiting for the dish, not sending data')
						print ADC.read(1)
					time.sleep(0.3)
				print(u'dish is served')

				weightArray = []
				previousWeight = ADC.read(1)
				count = 0
				high = 0
				low = 255
				foodNotFinished = True
				while foodNotFinished:
					currentWeight = ADC.read(1)
					weightArray.extend([currentWeight])
					print weightArray
					high = max(high, currentWeight)
					if currentWeight > 10:
						low = min(low, currentWeight)
        	                        thisOrder = order_ref.document(docs.id)
	                                thisOrder.update({u'weight': weightArray})

					time.sleep(0.3)
					if currentWeight < 10: # or (previousWeight > currentWeight) and ( previousWeight - currentWeight ) > weightError or (previousWeight < currentWeight) and ( currentWeight - previousWeight) > weightError:
						count+=1
						print(u'counter incremented')
						if count >= 5:
							foodNotFinished = False
					else:
						count = 0
					previousWeight = currentWeight

				print(u'food is finished')

				print(u'------Weight Array uploaded-------')
				print(high - low)
				db.collection(u'done_orders').document(docs.id).update({u'status': u'completed', u'leftover': high - low})
#				db.collection(u'done_orders').document(docs.id).set(thisOrder.get().to_dict())

				print(u'Order is completed')

			except KeyError:
				print(u'No such field!')
	except KeyError:
		print(u'No such document!')

def loop():
	while True:
		print ADC.read(1)
		scanIfOrderAssociated()
		time.sleep(0.3)
def destroy():
	ADC.write(0)

if __name__ == "__main__":
	try:
		setup()
		loop()
	except KeyboardInterrupt:
		destroy()
