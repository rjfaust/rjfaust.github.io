class ExclusionObject:
    def __init__(self, name, func, lineno, containingFuncStr):
        self.name = name
        self.lineno = lineno
        self.containingFuncStr = containingFuncStr
        self.func = func

        self.length = len(name)


