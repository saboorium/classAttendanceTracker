const fs = require("fs");

// =============================
// CONFIGURATION
// =============================

const timetable = {
    Monday: [
        "CS421G1",  // P1
        "CS424G2",  // P1

        "CS421G1",  // P2
        "CS424G2",  // P2

        "CS418",    // P3
        "CS419",    // P3

        "CS425",    // P6
        "CS412",    // P7
        "CG401"     // P8
    ],

    Tuesday: [
        "CS425",    // P1
        "CG401",    // P2

        "CS415",    // P3
        "CS417",    // P3

        "CS426",    // P5
        "CS426",    // P6

        "CS410"     // P7
    ],

    Wednesday: [
        "CS412",    // P1
        "CS425",    // P3
        "CS410",    // P4

        "CS415",    // P6
        "CS417"     // P6
    ],

    Thursday: [
        "CS412",    // P1
        "CS410",    // P2

        "CS415",    // P3
        "CS417",    // P3

        "CS418",    // P4
        "CS419",    // P4

        "CS412"     // P8
    ],

    Friday: [
        "CS418",    // P1
        "CS419",    // P1

        "CS418",    // P2
        "CS419",    // P2

        "CS410",    // P3
        "CS425",    // P4

        "CS415",    // P6
        "CS417"     // P6
    ],

    Saturday: [
        "CS424G1",  // P1
        "CS421G2",  // P1

        "CS424G1",  // P2
        "CS421G2"   // P2
    ],

    Sunday: []
};


// =============================
// DATE RANGE
// =============================

const startDate = "2026-07-13";
const endDate = "2026-08-24";


// =============================
// HOLIDAYS
// =============================

// Keep holidays in YYYY-MM-DD format
const holidays = [
    "2026-07-16",
    "2026-08-15"
];


// =============================
// SUBJECT LIST
// =============================

const subjectList = [
    "CS421G1",
    "CS421G2",
    "CS424G1",
    "CS424G2",
    "CS418",
    "CS419",
    "CS425",
    "CS412",
    "CG401",
    "CS415",
    "CS417",
    "CS426",
    "CS410"
];


// =============================
// DATE HELPERS
// =============================

const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


// Format date for CSV
// Example: 03 August
function formatDate(date) {

    const day = String(date.getDate()).padStart(2, "0");

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    return `${day} ${months[date.getMonth()]}`;
}


// Format date for holiday comparison
// Example: 2026-08-15
function formatHolidayDate(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =============================
// GET ALL VALID DATES
// =============================

function getDates(start, end) {

    const dates = [];

    let current = new Date(start + "T00:00:00");
    const last = new Date(end + "T00:00:00");

    while (current <= last) {

        // YYYY-MM-DD
        const holidayDate = formatHolidayDate(current);

        // DD Month
        const displayDate = formatDate(current);

        const dayName = dayNames[current.getDay()];

        // Skip holidays
        if (!holidays.includes(holidayDate)) {

            dates.push({
                date: displayDate,
                day: dayName
            });
        }

        current.setDate(
            current.getDate() + 1
        );
    }

    return dates;
}


// =============================
// GENERATE SUBJECT-DATE DATA
// =============================

function generateSchedule() {

    // Create object for every subject
    const subjects = {};

    for (const subject of subjectList) {
        subjects[subject] = [];
    }

    const dates = getDates(
        startDate,
        endDate
    );

    for (const entry of dates) {

        const classes =
            timetable[entry.day] || [];

        // IMPORTANT:
        // Every occurrence is processed.
        // Therefore duplicate subjects on the
        // same day are preserved.

        for (const subject of classes) {

            subjects[subject].push(
                entry.date
            );
        }
    }

    return subjects;
}


// =============================
// CREATE CSV
// =============================

function generateCSV(subjects) {

    // Find maximum number of classes
    // for any subject

    const maxDates = Math.max(
        ...Object.values(subjects)
            .map(dates => dates.length)
    );


    // Header

    const header = ["Subject"];

    for (
        let i = 1;
        i <= maxDates;
        i++
    ) {
        header.push(`Date ${i}`);
    }


    const rows = [header];


    // Create one row per subject

    for (
        const [subject, dates]
        of Object.entries(subjects)
    ) {

        const row = [subject];

        for (
            let i = 0;
            i < maxDates;
            i++
        ) {

            row.push(
                dates[i] || ""
            );
        }

        rows.push(row);
    }


    // Convert to CSV

    return rows
        .map(row =>
            row
                .map(value =>
                    `"${String(value)
                        .replace(/"/g, '""')}"`
                )
                .join(",")
        )
        .join("\n");
}


// =============================
// RUN
// =============================

const subjects = generateSchedule();

const csv = generateCSV(subjects);

fs.writeFileSync(
    "subject_schedule.csv",
    csv
);

console.log(
    "CSV generated successfully!"
);

console.log(
    "File: subject_schedule.csv"
);