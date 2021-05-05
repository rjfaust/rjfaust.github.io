import uuid

class TrackObject:
    def __init__(self, name, var, lineno, offset, containingFuncStr, custom=None):
        self.name = name
        self.var = var
        self.custom = custom
        self.lineno = lineno
        self.offset = offset
        self.containingFunc = containingFuncStr
        self.origName = name
        self.length = len(name)
        self.id = str(uuid.uuid4().hex)



