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

const attendanceFile = "attendance_uploaded.csv";


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

    if (!fs.existsSync(attendanceFile)) {

        console.error(
            `ERROR: ${attendanceFile} not found.`
        );

        process.exit(1);
    }


    const content =
        fs.readFileSync(
            attendanceFile,
            "utf8"
        );


    const lines =
        content
            .split(/\r?\n/)
            .filter(line => line.trim() !== "");


    const uploaded = {};


    // Skip header
    for (let i = 1; i < lines.length; i++) {

        const columns =
            parseCSVLine(lines[i]);


        const subject =
            columns[0]?.trim();


        if (!subject) {
            continue;
        }


        uploaded[subject] = [];


        for (
            let j = 1;
            j < columns.length;
            j++
        ) {

            const date =
                columns[j]?.trim();


            if (!date) {
                continue;
            }


            const isoDate =
                displayDateToISO(date);


            if (isoDate) {

                uploaded[subject].push({
                    date: date,
                    isoDate: isoDate
                });
            }
        }
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