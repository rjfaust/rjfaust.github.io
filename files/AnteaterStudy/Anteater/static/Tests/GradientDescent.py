from collections import namedtuple

TrainingInstance = namedtuple("TrainingInstance", ['X', 'Y'])

training_set = [
    TrainingInstance(60, 3.1), TrainingInstance(61, 3.6),
    TrainingInstance(62, 3.8), TrainingInstance(63, 4),
    TrainingInstance(65, 4.1)]

def grad_desc(x, x1):
    # minimize a cost function of two variables
    # using gradient descent
    training_rate = 0.1
    iterations = 200
    while iterations > 0:
        x, x1 = (x - (training_rate * deriv(x, x1)),
                 x1 - (training_rate * deriv1(x, x1)))
        iterations -= 1
    return x, x1

def deriv(x, x1):
    sum = 0.0
    for inst in training_set:
        sum += ((x + x1 * inst.X) - inst.Y)
    return sum / len(training_set)

def deriv1(x, x1):
    sum = 0.0
    for inst in training_set:
        sum += ((x + x1 * inst.X) - inst.Y) * inst.X
    return sum / len(training_set)

if __name__ == "__main__":
    x,x1 = grad_desc(2, 2)
    print(x)
    print(x1)
