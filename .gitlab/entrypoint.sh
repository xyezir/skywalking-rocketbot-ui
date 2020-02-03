#!/bin/bash
export NAME_SERVER=`cat /etc/resolv.conf | grep "nameserver" | awk '{print $2}' | tr '\n' ' '`
exec "$@"
