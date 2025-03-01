class ShiftScheduler {
  constructor() {
    this.employees = {};
    this.schedule = {
      Monday: { morning: [], afternoon: [], evening: [] },
      Tuesday: { morning: [], afternoon: [], evening: [] },
      Wednesday: { morning: [], afternoon: [], evening: [] },
      Thursday: { morning: [], afternoon: [], evening: [] },
      Friday: { morning: [], afternoon: [], evening: [] },
      Saturday: { morning: [], afternoon: [], evening: [] },
      Sunday: { morning: [], afternoon: [], evening: [] },
    };
  }

  addEmployee(name, preferences) {
    this.employees[name] = {
      preferences,
      assignedDays: 0,
      assignedShifts: new Set(),
    };
  }

  assignShifts() {
    const days = Object.keys(this.schedule);

    for (const day of days) {
      let assignedToday = new Set();

      for (const shift of ['morning', 'afternoon', 'evening']) {
        let preferredEmployees = Object.entries(this.employees)
          .filter(
            ([name, data]) =>
              data.assignedDays < 5 &&
              data.preferences[day] === shift &&
              !assignedToday.has(name)
          )
          .map(([name]) => name);

        this.schedule[day][shift].push(
          ...preferredEmployees.slice(0, 2)
        );
        preferredEmployees.slice(0, 2).forEach((employee) => {
          this.employees[employee].assignedDays++;
          this.employees[employee].assignedShifts.add(day);
          assignedToday.add(employee);
        });
      }

      for (const shift of ['morning', 'afternoon', 'evening']) {
        while (this.schedule[day][shift].length < 2) {
          let availableEmployees = Object.entries(this.employees)
            .filter(
              ([name, data]) =>
                data.assignedDays < 5 && !assignedToday.has(name)
            )
            .map(([name]) => name);

          if (availableEmployees.length > 0) {
            let chosen =
              availableEmployees[
                Math.floor(Math.random() * availableEmployees.length)
              ];
            this.schedule[day][shift].push(chosen);
            this.employees[chosen].assignedDays++;
            this.employees[chosen].assignedShifts.add(day);
            assignedToday.add(chosen);
          } else {
            break;
          }
        }
      }
    }
  }

  displaySchedule() {
    for (const [day, shifts] of Object.entries(this.schedule)) {
      console.log(`${day}:`);
      for (const [shift, employees] of Object.entries(shifts)) {
        console.log(
          `  ${
            shift.charAt(0).toUpperCase() + shift.slice(1)
          }: ${employees.join(', ')}`
        );
      }
      console.log();
    }
  }
}

// Example usage
const scheduler = new ShiftScheduler();
const preferences = {
  Alice: {
    Monday: 'morning',
    Tuesday: 'afternoon',
    Wednesday: 'morning',
    Thursday: 'morning',
    Friday: 'morning',
    Saturday: 'evening',
    Sunday: 'afternoon',
  },
  Bob: {
    Monday: 'morning',
    Tuesday: 'afternoon',
    Wednesday: 'evening',
    Thursday: 'morning',
    Friday: 'evening',
    Saturday: 'evening',
    Sunday: 'evening',
  },
  Charlie: {
    Monday: 'afternoon',
    Tuesday: 'morning',
    Wednesday: 'afternoon',
    Thursday: 'evening',
    Friday: 'afternoon',
    Saturday: 'morning',
    Sunday: 'afternoon',
  },
  Dan: {
    Monday: 'afternoon',
    Tuesday: 'evening',
    Wednesday: 'afternoon',
    Thursday: 'evening',
    Friday: 'afternoon',
    Saturday: 'evening',
    Sunday: 'afternoon',
  },
  Mash: {
    Monday: 'morning',
    Tuesday: 'evening',
    Wednesday: 'evening',
    Thursday: 'evening',
    Friday: 'morning',
    Saturday: 'evening',
    Sunday: 'afternoon',
  },
  Nan: {
    Monday: 'evening',
    Tuesday: 'morning',
    Wednesday: 'morning',
    Thursday: 'afternoon',
    Friday: 'morning',
    Saturday: 'afternoon',
    Sunday: 'afternoon',
  },
  Kel: {
    Monday: 'morning',
    Tuesday: 'eveninng',
    Wednesday: 'afternoon',
    Thursday: 'evening',
    Friday: 'morning',
    Saturday: 'evening',
    Sunday: 'evening',
  },
  Avi: {
    Monday: 'afternoon',
    Tuesday: 'afternoon',
    Wednesday: 'morning',
    Thursday: 'morning',
    Friday: 'morning',
    Saturday: 'afternoon',
    Sunday: 'morning',
  },
};

for (const [name, prefs] of Object.entries(preferences)) {
  scheduler.addEmployee(name, prefs);
}

scheduler.assignShifts();
scheduler.displaySchedule();
