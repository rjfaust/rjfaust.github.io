import numpy as np
import json

def doThings(x,y):

    for i in range(10):
        z = np.random.randint(0,50,10).sum()
        result2 = 2*x*z
        result3 = result2 + y
        result = pow(result3,2)
    return result

def doStringThings(s,l):

    offset = 0
    extraChars = l-len(s)
    s_new = s
    for i in range(extraChars):
        if offset > 3:
            offset = 0
        s_new = s_new + s[offset]
        offset += 1
    return s_new


def do_dict_things(d, keyL):
    a = "abcdefghijklmnopqrstuvwxyz"
    #generate key
    vals = np.random.randint(0,26,keyL)
    key = ""
    for v in vals:
        key+=a[v]
    #create val
    d.update({key:pow(keyL,2)})
    return d

if __name__=="__main__":
    xVals = np.random.randint(0,50,10)
    yVals = np.random.randint(0, 50, 10)

    l = np.random.randint(5,10,10)
    s= "test"

    d = {}
    keys = np.random.randint(1,8,10)
    for i in range(len(keys)):
        d = do_dict_things(d,keys[i])
        j = i * 2
        z = doThings(xVals[i], yVals[i])
        s_new = doStringThings(s,l[i])

