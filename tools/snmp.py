from pysnmp.hlapi import *

# Define the target device IP, SNMP community, and base OID for the walk
target = '10.1.127.1'
community = 'public'
oid = '1.3.6.1.2.1.2.2.1.2'  # OID for ifDescr

# Perform SNMP WALK operation
for (errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(
    SnmpEngine(),
    CommunityData(community, mpModel=0),
    UdpTransportTarget((target, 161)),
    ContextData(),
    ObjectType(ObjectIdentity(oid)),
    lexicographicMode=False  # Set to False to stop the walk at the end of the MIB subtree
):

    if errorIndication:
        print(errorIndication)
        break
    elif errorStatus:
        print('%s at %s' % (errorStatus.prettyPrint(),
                            errorIndex and varBinds[int(errorIndex) - 1][0] or '?'))
        break
    else:
        for varBind in varBinds:
            print(' = '.join([x.prettyPrint() for x in varBind]))
