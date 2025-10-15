# Problem 1: Hello World
def hello_world():
    return "Hello, World!"

# Problem 2: Sum of two numbers
def sum_two_numbers(a, b):
    return a + b

# Problem 3: Factorial of a number
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

# Problem 4: Check if a number is even or odd
def is_even_or_odd(n):
    if n % 2 == 0:
        return "Even"
    else:
        return "Odd"

# Problem 5: Find the maximum of two numbers
def max_of_two(a, b):
    return max(a, b)

# Problem 6: Reverse a string
def reverse_string(s):
    return s[::-1]

# Problem 7: Check if a string is a palindrome
def is_palindrome(s):
    return s == s[::-1]

# Problem 8: Calculate the area of a circle
import math
def circle_area(radius):
    return math.pi * radius**2

# Problem 9: Convert Celsius to Fahrenheit
def celsius_to_fahrenheit(celsius):
    return (celsius * 9/5) + 32

# Problem 10: Generate Fibonacci sequence up to n terms
def fibonacci_sequence(n):
    sequence = []
    a, b = 0, 1
    while len(sequence) < n:
        sequence.append(a)
        a, b = b, a + b
    return sequence

# Problem 11: Find the largest element in a list
def largest_element(lst):
    return max(lst)

# Problem 12: Find the smallest element in a list
def smallest_element(lst):
    return min(lst)

# Problem 13: Count the occurrences of an element in a list
def count_occurrences(lst, element):
    return lst.count(element)

# Problem 14: Remove duplicates from a list
def remove_duplicates(lst):
    return list(set(lst))

# Problem 15: Check if