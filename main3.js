const fs = require("fs");

// =====================================================
// CONFIGURATION
// =====================================================

const timetable = {
    Monday: [
        "CS421G1",
        "CS424G2",
        "CS421G1",
        "CS424G2",
        "CS418",
        "CS419",
        "CS425",
        "CS412",
        "CG401"
    ],

    Tuesday: [
        "CS425",
        "CG401",
        "CS415",
        "CS417",
        "CS426",
        "CS426",
        "CS410"
    ],

    Wednesday: [
        "CS412",
        "CS425",
        "CS410",
        "CS415",
        "CS417"
    ],

    Thursday: [
        "CS412",
        "CS410",
        "CS415",
        "CS417",
        "CS418",
        "CS419",
        "CS412"
    ],

    Friday: [
        "CS418",
        "CS419",
        "CS418",
        "CS419",
        "CS410",
        "CS425",
        "CS415",
        "CS417"
    ],

    Saturday: [
        "CS424G1",
        "CS421G2",
        "CS424G1",
        "CS421G2"
    ],

    Sunday: []
};


// =====================================================
// DATE RANGE
// =====================================================

const startDate = "2026-08-01";
const endDate = "2026-08-31";


// =====================================================
// HOLIDAYS
// =====================================================

const holidays = [
    "2026-07-16",
    "2026-08-15"
];


// =====================================================
// ATTENDANCE CSV
// =====================================================

const attendance = [
  // CS426 — Competitive Coding
  { subject: "CS426", date: "2026-07-14", period: "P5", status: "A" },
  { subject: "CS426", date: "2026-07-14", period: "P6", status: "A" },
  { subject: "CS426", date: "2026-07-21", period: "P5", status: "A" },
  { subject: "CS426", date: "2026-07-21", period: "P6", status: "A" },
  { subject: "CS426", date: "2026-07-28", period: "P5", status: "A" },
  { subject: "CS426", date: "2026-07-28", period: "P6", status: "A" },

  // CS425 — Introduction to Machine Learning
  { subject: "CS425", date: "2026-07-13", period: "P6", status: "A" },
  { subject: "CS425", date: "2026-07-15", period: "P3", status: "P" },
  { subject: "CS425", date: "2026-07-17", period: "P4", status: "A" },
  { subject: "CS425", date: "2026-07-20", period: "P6", status: "A" },
  { subject: "CS425", date: "2026-07-21", period: "P1", status: "P" },
  { subject: "CS425", date: "2026-07-22", period: "P3", status: "P" },
  { subject: "CS425", date: "2026-07-24", period: "P4", status: "A" },
  { subject: "CS425", date: "2026-07-27", period: "P6", status: "P" },
  { subject: "CS425", date: "2026-07-28", period: "P1", status: "A" },
  { subject: "CS425", date: "2026-07-29", period: "P3", status: "P" },
  { subject: "CS425", date: "2026-08-03", period: "P6", status: "A" },
  { subject: "CS425", date: "2026-08-05", period: "P3", status: "P" },
  { subject: "CS425", date: "2026-08-07", period: "P4", status: "P" },
  { subject: "CS425", date: "2026-08-10", period: "P6", status: "P" },
  { subject: "CS425", date: "2026-08-11", period: "P1", status: "A" },
  { subject: "CS425", date: "2026-08-12", period: "P3", status: "P" },
  { subject: "CS425", date: "2026-08-14", period: "P3", status: "P" },
  { subject: "CS425", date: "2026-08-17", period: "P6", status: "A" },
  { subject: "CS425", date: "2026-08-18", period: "P1", status: "A" },
  { subject: "CS425", date: "2026-08-19", period: "P3", status: "P" },

  // CG401 — Career Development Course
  { subject: "CG401", date: "2026-07-20", period: "P8", status: "A" },
  { subject: "CG401", date: "2026-07-27", period: "P8", status: "A" },

  // CS424 — SciLab
  { subject: "CS424", date: "2026-07-25", period: "P1", status: "A" },
  { subject: "CS424", date: "2026-07-25", period: "P2", status: "A" },
  { subject: "CS424", date: "2026-08-01", period: "P1", status: "P" },
  { subject: "CS424", date: "2026-08-01", period: "P2", status: "P" },
  { subject: "CS424", date: "2026-08-08", period: "P1", status: "P" },
  { subject: "CS424", date: "2026-08-08", period: "P2", status: "P" },

  // CS415 — Fuzzy Logic & Neural Networks
  { subject: "CS415", date: "2026-07-21", period: "P3", status: "P" },
  { subject: "CS415", date: "2026-07-22", period: "P6", status: "P" },
  { subject: "CS415", date: "2026-07-23", period: "P3", status: "P" },
  { subject: "CS415", date: "2026-07-28", period: "P3", status: "P" },
  { subject: "CS415", date: "2026-08-05", period: "P6", status: "P" },
  { subject: "CS415", date: "2026-08-12", period: "P3", status: "P" },
  { subject: "CS415", date: "2026-08-13", period: "P3", status: "P" },
  { subject: "CS415", date: "2026-08-14", period: "P6", status: "P" },
  { subject: "CS415", date: "2026-08-21", period: "P6", status: "A" },

  // CS412 — Cryptography and Network Security
  { subject: "CS412", date: "2026-07-22", period: "P1", status: "P" },
  { subject: "CS412", date: "2026-07-23", period: "P1", status: "P" },
  { subject: "CS412", date: "2026-07-23", period: "P8", status: "P" },

  // CS410 — Distributed Systems
  { subject: "CS410", date: "2026-07-21", period: "P7", status: "A" },
  { subject: "CS410", date: "2026-07-22", period: "P4", status: "P" },
  { subject: "CS410", date: "2026-07-24", period: "P3", status: "P" },
  { subject: "CS410", date: "2026-07-28", period: "P7", status: "P" },
  { subject: "CS410", date: "2026-07-29", period: "P4", status: "A" },
  { subject: "CS410", date: "2026-07-30", period: "P2", status: "A" },
  { subject: "CS410", date: "2026-08-05", period: "P4", status: "P" },
  { subject: "CS410", date: "2026-08-06", period: "P2", status: "P" },
  { subject: "CS410", date: "2026-08-07", period: "P3", status: "A" },
  { subject: "CS410", date: "2026-08-11", period: "P7", status: "P" },
  { subject: "CS410", date: "2026-08-13", period: "P2", status: "A" },
  { subject: "CS410", date: "2026-08-14", period: "P3", status: "P" },
  { subject: "CS410", date: "2026-08-18", period: "P7", status: "P" },
  { subject: "CS410", date: "2026-08-19", period: "P4", status: "P" }
];

// =====================================================
// DATE INFORMATION
// =====================================================

const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

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


// =====================================================
// FORMAT DATE
// =====================================================

// YYYY-MM-DD
function formatISODate(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// DD Month
function formatDisplayDate(date) {

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${day} ${months[date.getMonth()]}`;
}


// =====================================================
// CONVERT DD MONTH TO YYYY-MM-DD
// =====================================================

function displayDateToISO(dateString) {

    const parts = dateString.trim().split(/\s+/);

    if (parts.length !== 2) {
        return null;
    }

    const day = parseInt(parts[0]);

    const monthIndex =
        months.indexOf(parts[1]);

    if (
        isNaN(day) ||
        monthIndex === -1
    ) {
        return null;
    }

    const year =
        new Date(startDate).getFullYear();

    const date = new Date(
        year,
        monthIndex,
        day
    );

    return formatISODate(date);
}


// =====================================================
// GENERATE EXPECTED ATTENDANCE
// =====================================================

function generateExpected() {

    const expected = {};

    let current =
        new Date(startDate + "T00:00:00");

    const last =
        new Date(endDate + "T00:00:00");


    while (current <= last) {

        const isoDate =
            formatISODate(current);

        const displayDate =
            formatDisplayDate(current);

        const day =
            dayNames[current.getDay()];


        // Skip holidays
        if (!holidays.includes(isoDate)) {

            const classes =
                timetable[day] || [];


            // Every array entry is one class.
            //
            // Therefore:
            //
            // CS426
            // CS426
            //
            // = TWO expected attendance entries.

            for (const subject of classes) {

                if (!expected[subject]) {
                    expected[subject] = [];
                }

                expected[subject].push({
                    date: displayDate,
                    isoDate: isoDate
                });
            }
        }


        current.setDate(
            current.getDate() + 1
        );
    }


    return expected;
}


// =====================================================
// CSV PARSER
// =====================================================

function parseCSVLine(line) {

    const values = [];

    let value = "";
    let quoted = false;


    for (let i = 0; i < line.length; i++) {

        const char = line[i];


        if (char === '"') {

            if (
                quoted &&
                line[i + 1] === '"'
            ) {
                value += '"';
                i++;
            }
            else {
                quoted = !quoted;
            }

        }
        else if (
            char === "," &&
            !quoted
        ) {

            values.push(value);
            value = "";

        }
        else {

            value += char;
        }
    }


    values.push(value);

    return values;
}


// =====================================================
// READ ATTENDANCE CSV
// =====================================================

function readAttendance() {

    const uploaded = {};

    for (const entry of attendance) {

        if (!uploaded[entry.subject]) {
            uploaded[entry.subject] = [];
        }

        uploaded[entry.subject].push({
            date: entry.date,
            isoDate: entry.date,
            period: entry.period,
            status: entry.status
        });
    }

    return uploaded;
}


// =====================================================
// COMPARE EXPECTED VS UPLOADED
// =====================================================

function compare(expected, uploaded) {

    const results = {};


    for (
        const subject of Object.keys(expected)
    ) {

        const expectedEntries =
            expected[subject];


        const uploadedEntries =
            uploaded[subject] || [];


        // Count uploaded occurrences
        // separately for every date.

        const uploadedCount = {};


        for (
            const entry of uploadedEntries
        ) {

            if (!uploadedCount[entry.isoDate]) {
                uploadedCount[entry.isoDate] = 0;
            }

            uploadedCount[entry.isoDate]++;
        }


        const missing = [];


        // Compare every expected class
        for (
            const entry of expectedEntries
        ) {

            if (
                uploadedCount[entry.isoDate] &&
                uploadedCount[entry.isoDate] > 0
            ) {

                uploadedCount[entry.isoDate]--;

            }
            else {

                missing.push(entry.date);
            }
        }


        results[subject] = {
            expected: expectedEntries.length,
            uploaded: uploadedEntries.length,
            missing: missing.length,
            missingDates: missing
        };
    }


    return results;
}


// =====================================================
// CREATE REPORT
// =====================================================

function createCSV(results) {

    const rows = [];


    rows.push([
        "Subject",
        "Expected",
        "Uploaded",
        "Missing",
        "Missing Dates"
    ]);


    for (
        const [subject, data]
        of Object.entries(results)
    ) {

        rows.push([
            subject,
            data.expected,
            data.uploaded,
            data.missing,
            data.missingDates.join(" | ")
        ]);
    }


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


// =====================================================
// RUN
// =====================================================

console.log(
    "Checking attendance..."
);


const expected =
    generateExpected();


const uploaded =
    readAttendance();


const results =
    compare(
        expected,
        uploaded
    );


const report =
    createCSV(results);


fs.writeFileSync(
    "attendance_missing_report.csv",
    report
);


console.log(
    "Attendance check complete!"
);

console.log(
    "Created: attendance_missing_report.csv"
);


// =====================================================
// TERMINAL SUMMARY
// =====================================================

console.log("\nMissing attendance:");

for (
    const [subject, data]
    of Object.entries(results)
) {

    if (data.missing > 0) {

        console.log(
            `${subject}: ${data.missing} missing`
        );

        console.log(
            `  ${data.missingDates.join(", ")}`
        );

    } else {

        console.log(
            `${subject}: COMPLETE`
        );
    }
}