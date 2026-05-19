export const EXAMPLES = [
  {
    label: "Functions",
    code: `tax_rate = 0.08

def total(price, quantity):
    subtotal = price * quantity
    return subtotal + subtotal * tax_rate

total(12, 3)`,
  },
  {
    label: "Classes",
    code: `class Dog:
    species = "canine"

    def __init__(self, name):
        self.name = name

    def speak(self):
        return self.name + " says woof"

dog = Dog("Buster")
dog.speak()`,
  },
  {
    label: "Closures",
    code: `def make_adder(base):
    def add(value):
        return base + value

    return add

add_five = make_adder(5)
add_five(9)`,
  },
  {
    label: "Loops",
    code: `total = 0

for value in [1, 2, 3, 4]:
    total = total + value

total`,
  },
];

export const DEFAULT_CODE = EXAMPLES[0].code;
