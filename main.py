import random
from collections import defaultdict

class ShiftScheduler:
    def __init__(self):
        self.employees = {}
        self.schedule = defaultdict(lambda: {"morning": [], "afternoon": [], "evening": []})

    def add_employee(self, name, preferences):
        """Add an employee with their shift preferences."""
        self.employees[name] = {"preferences": preferences, "assigned_days": 0, "assigned_shifts": set()}

    def assign_shifts(self):
        """Assign shifts while ensuring constraints."""
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]

        for day in days:
            assigned_today = set()
            for shift in ["morning", "afternoon", "evening"]:
                preferred_employees = [name for name, data in self.employees.items()
                                       if data["assigned_days"] < 5 and data["preferences"].get(day) == shift
                                       and name not in assigned_today]

                # Assign employees who prefer this shift
                self.schedule[day][shift].extend(preferred_employees[:2])
                for employee in preferred_employees[:2]:
                    self.employees[employee]["assigned_days"] += 1
                    self.employees[employee]["assigned_shifts"].add(day)
                    assigned_today.add(employee)

            # Ensure preferences choices are set first before setting random employee
            for shift in ["morning", "afternoon", "evening"]:
                # Ensure at least 2 employees per shift
                while len(self.schedule[day][shift]) < 2:
                    available_employees = [name for name, data in self.employees.items()
                                           if data["assigned_days"] < 5 and name not in assigned_today]

                    if available_employees:
                        chosen = random.choice(available_employees)
                        self.schedule[day][shift].append(chosen)
                        self.employees[chosen]["assigned_days"] += 1
                        self.employees[chosen]["assigned_shifts"].add(day)
                        assigned_today.add(chosen)
                    else:
                        break

    def display_schedule(self):
        """Print the weekly schedule."""
        for day, shifts in self.schedule.items():
            print(f"{day}:")
            for shift, employees in shifts.items():
                print(f"  {shift.capitalize()}: {', '.join(employees)}")
            print()

if __name__ == "__main__":
    scheduler = ShiftScheduler()
    preferences = {
        "Alice": {"Monday": "morning", "Tuesday": "afternoon", "Wednesday": "morning", "Thursday":"morning", "Friday":"morning", "Saturday":"evening", "Sunday":"afternoon"},
        "Bob": {"Monday": "morning", "Tuesday": "afternoon", "Wednesday": "evening", "Thursday":"morning", "Friday":"evening", "Saturday":"evening", "Sunday":"evening"},
        "Charlie": {"Monday": "afternoon", "Tuesday": "morning", "Wednesday": "afternoon", "Thursday":"evening", "Friday":"afternoon", "Saturday":"morning", "Sunday":"afternoon"},
        "Dan": {"Monday": "afternoon", "Tuesday": "evening", "Wednesday": "afternoon", "Thursday":"evening", "Friday":"afternoon", "Saturday":"evening", "Sunday":"afternoon"},
        "Mash": {"Monday": "morning", "Tuesday": "evening", "Wednesday": "evening", "Thursday":"evening", "Friday":"morning", "Saturday":"evening", "Sunday":"afternoon"},
        "Nan": {"Monday": "evening", "Tuesday": "morning", "Wednesday": "morning", "Thursday":"afternoon", "Friday":"morning", "Saturday":"afternoon", "Sunday":"afternoon"},
        "Kel": {"Monday": "morning", "Tuesday": "eveninng", "Wednesday": "afternoon", "Thursday":"evening", "Friday":"morning", "Saturday":"evening", "Sunday":"evening"},
        "Avi": {"Monday": "afternoon", "Tuesday": "afternoon", "Wednesday": "morning", "Thursday":"morning", "Friday":"morning", "Saturday":"afternoon", "Sunday":"morning"},
    }

    for name, prefs in preferences.items():
        scheduler.add_employee(name, prefs)

    scheduler.assign_shifts()
    scheduler.display_schedule()