from dataclasses import dataclass, field
from typing import List
@dataclass(order=True)
class Student:
    grade: float
    name: str = field(compare=False)
    courses: List[str] = field(default_factory=list, compare=False)

    def add_course(self, course: str):
        self.courses.append(course)

    def gpa_status(self) -> str:
        if self.grade >= 3.5:
            return "Honors"

        if self.grade >= 2.0:
            return "Satisfactory"
        return "Probation"

if __name__ == "__main__":
    s1 = Student(3.8, "Alice")
    s1.add_course("Math")
    s1.add_course("CS101")
    s2 = Student(2.5, "Bob")
    print(s1, s1.gpa_status())
    print(s2, s2.gpa_status())
    students = [s1, s2]
    students.sort(reverse=True)

    print("Sorted by GPA:", [s.name for s in students])
