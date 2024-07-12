from pysnmp.hlapi import *

# Define the target device IP, SNMP community, and OID
target = '10.1.127.120'
community = 'test'
oid = '1.3.6.1.2.1.1.1.0'  # OID for sysDescr

# Perform SNMP GET operation
errorIndication, errorStatus, errorIndex, varBinds = next(
    getCmd(SnmpEngine(),
           CommunityData(community, mpModel=0),
           UdpTransportTarget((target, 161)),
           ContextData(),
           ObjectType(ObjectIdentity(oid)))
)

# Check for errors and process the response
if errorIndication:
    print(errorIndication)
elif errorStatus:
    print('%s at %s' % (errorStatus.prettyPrint(),
                        errorIndex and varBinds[int(errorIndex) - 1][0] or '?'))
else:
    for varBind in varBinds:
        print(' = '.join([x.prettyPrint() for x in varBind]))
