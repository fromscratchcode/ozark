interface Example {
  label: string;
  code: string;
}

export const EXAMPLES: Example[] = [
  {
    label: "Functions",
    code: `tax_rate = 0.08

def total(price, quantity):
    subtotal = price * quantity
    return subtotal + subtotal * tax_rate

print(total(12, 3))`,
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
print(dog.speak())`,
  },
  {
    label: "Closures",
    code: `def make_adder(base):
    def add(value):
        return base + value

    return add

add_five = make_adder(5)
print(add_five(9))`,
  },
  {
    label: "Loops",
    code: `total = 0

for value in [1, 2, 3, 4]:
    total = total + value

print(total)`,
  },
];

export const DEFAULT_CODE = EXAMPLES[0].code;
