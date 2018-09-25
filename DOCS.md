# express-mongo-rest-k8s-sample v0.1.0



- [Vdobject](#vdobject)
	- [Create or Update vdobject](#create-or-update-vdobject)
	- [Retrieve vdobject](#retrieve-vdobject)
	- [Retrieve vdobjects](#retrieve-vdobjects)
	


# Vdobject

## Create or Update vdobject



	POST /vdobject


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| mykey			| 			|  <p>Vdobject's key with its value, e.g. {mykey : value1}</p>							|

## Retrieve vdobject



	GET /vdobject/:myKey


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| timestamp			| Number			| **optional** <p>Unixtime second unit (e.g. 1537693722).</p>							|

## Retrieve vdobjects



	GET /vdobject



