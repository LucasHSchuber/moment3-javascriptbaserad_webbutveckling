// This imports Express and uses the in-built router object in Express
const express = require("express");
const router = express.Router();

// Now we need MongoClient from mongodb npm package and...
const { MongoClient } = require("mongodb");
const mongoURL = "mongodb://localhost:27017"; // ... its connection...
const mongoDB = "myCV"; // ... and DB name...
const mongoCL = "courses"; // ... plus collection name!

// Import file system module ('fs') and file pathing ('path') from NodeJS
// These are used to handle the `courses-BACKUP.json` file which restores when clicked on "Återställ allt"
const fs = require("fs");
const path = require("path");
const backupFile = path.join(__dirname, "../courses-BACKUP.json");

// Helper function that just returns response code and json message to keep things DRY
function codeWithJSONRes(res, code, json) {
  return res.status(code).json(json);
}

// Here are the different CRUD routes where req = request being received
// and res = response being sent back for the request in question.
// BTW: "let client;" is so scope works with finally{} part in all try-catch blocks!

// RESET courses.json file by deleting it and making a copy of "courses-BACKUP.json" and renaming it to "courses.json"
router.get("/reset", async (req, res) => {
  // Use try + catch blocks
  let client;
  try {
    // Initiate connection and database name and its collection ("db=myCV", "col=courses")
    client = new MongoClient(mongoURL);
    await client.connect();
    const db = client.db(mongoDB);
    const col = db.collection(mongoCL);

    // Read JSON data from backup file
    const fileData = fs.readFileSync(backupFile);
    const jsonData = JSON.parse(fileData);

    // Then drop current collection and insert that backup data as many document objects to collection!
    await col.drop(); // We drop to restore the correct amount of courses back again!
    await col.insertMany(jsonData);

    // We can only end up here if we succeeded restoring courses in the MongoDB database!

    res.status(200).json({ message: "Kurserna återställda!" });
  } catch (err) {
    // Catch and return 500 Internal Error if it happens!
    return res.status(500).json({
      message: "Misslyckades på serversidan att återställa kurserna!",
    });
  } finally {
    // Always do no matter what try-catch result!
    // Close MongoDB connection
    client.close();
  }
});

// GET all courses
router.get("/courses", async (req, res) => {
  // Initiate connection and database name and its collection ("db=myCV", "col=courses")
  let client;
  try {
    client = new MongoClient(mongoURL);
    await client.connect();
    const db = client.db(mongoDB);
    const col = db.collection(mongoCL);

    // Use a "cursor" in MongoDB to grab the result
    const cursor = col.find({}); // Find ALL objects in that collection
    const courses = await cursor.toArray(); // Convert to array to sen back!

    // Then finally return courses unless they are zero!
    if (courses == "[]" || courses.length == 0) {
      return res
        .status(500)
        .json({ message: "Inga kurser finns? Klicka på 'Återställ allt'!" });
    } // Courses exist so send them!
    else {
      return res.status(200).json(courses);
    }
  } catch (err) {
    // Catch and return 500 Internal Error if it happens!
    return res.status(500).json({
      message: "Misslyckades på serversidan att läsa in kurserna kurserna!",
    });
  } finally {
    // Always do this no matter what!
    client.close();
  }
});

// DELETE one specific course
router.delete("/courses/:id", async (req, res) => {
  // When ":id" is not an integer after trying parsing it
  if (!Number.isInteger(parseInt(req.params.id))) {
    // Return message and this ends execution right here.
    // Here we use a helper function for that to keep things DRY
    return codeWithJSONRes(res, 422, {
      message: `Provide a number for the course! ${req.params.id} is not a number.`,
    });
    // The commented one below is otherwise what would be used:
    //res.status(422).json({ message: "Provide a number for the course!" });
  }

  // Store picked id
  const id = parseInt(req.params.id);
  let client;
  try {
    client = new MongoClient(mongoURL);
    await client.connect();
    const db = client.db(mongoDB);
    const col = db.collection(mongoCL);

    // Try delete the selected id in MongoDB and store its result
    const dbResult = await col.deleteOne({ id: id });

    // Check if document was deleted!
    if (dbResult.deletedCount === 1) {
      return res
        .status(200)
        .json({ message: `Kurs med id:${req.params.id} raderad!` });
    } else {
      // Document object not found so report back that!
      return res
        .status(404)
        .json({ message: `Kursen med id:${id} finns inte!` });
    }
  } catch (err) {
    // Catch and return 500 Internal Error if it happens!
    return res.status(500).json({
      message: "Misslyckades på serversidan att läsa in kurserna kurserna!",
    });
  } finally {
    // Always do this no matter what!
    client.close();
  }
});

// GET one specififc course
router.get("/courses/:id", async (req, res) => {
  // When ":id" is not an integer after trying parsing it
  if (!Number.isInteger(parseInt(req.params.id))) {
    // Return message and this ends execution right here.
    // Here we use a helper function for that to keep things DRY
    return codeWithJSONRes(res, 422, {
      message: `Provide a number for the course! ${req.params.id} is not a number.`,
    });
    // The commented one below is otherwise what would be used:
    //res.status(422).json({ message: "Provide a number for the course!" });
  }
  // Initiate connection and database name and its collection ("db=myCV", "col=courses")
  let client;
  const id = parseInt(req.params.id); // integer id value!
  try {
    client = new MongoClient(mongoURL);
    await client.connect();
    const db = client.db(mongoDB);
    const col = db.collection(mongoCL);

    // Try find that single course!
    const singleCourse = await col.findOne({ id: id }); // Convert to array to sen back!

    // If it exists then we return it
    if (singleCourse) {
      return res.status(200).json(singleCourse);
    } // If it doesn't exist
    else {
      return res
        .status(404)
        .json({ message: `Kursen med id:${id} finns inte!` });
    }
  } catch (err) {
    // Catch and return 500 Internal Error if it happens!
    return res.status(500).json({
      message: "Misslyckades på serversidan att hitta kursen!",
    });
  } finally {
    // Always do this no matter what!
    client.close();
  }
});

// UPDATE one specific course
router.put("/courses/:id", async (req, res) => {
  // When ":id" is not an integer after trying parsing it
  if (!Number.isInteger(parseInt(req.params.id))) {
    // Return message and this ends execution right here.
    // Here we use a helper function for that to keep things DRY
    return codeWithJSONRes(res, 422, {
      message: `Ange ett id i heltal för kursen då ${req.params.id} ej är det.`,
    });
    // The commented one below is otherwise what would be used:
    //res.status(422).json({ message: "Provide a number for the course!" });
  }
  // Let's now check and make sure all JSON data are correct otherwise, there is no reason to read the file!
  // Checks for courseId
  if (!req.body.courseId) {
    return res.status(400).json({ message: "Ange en kurskod!" });
  }
  const regex = /^[A-Z]{2}\d{3}[A-Z]$/; // FORMAT: Two uppercase letters then 3 digits and then one uppercase letter
  if (!regex.test(req.body.courseId)) {
    return res.status(400).json({
      message:
        "Kurskod ska vara i formatet: IK060G (två stora bokstäver, tre siffror och sedan en stor bokstav i slutet)!",
    });
  }

  // Checks for course name
  if (!req.body.courseName) {
    return res.status(400).json({ message: "Ange ett kursnamn!" });
  }
  if (req.body.courseName.length <= 10) {
    return res.status(400).json({ message: "Kursnamnet är för kort!" });
  }

  // Checks for course period
  if (!req.body.coursePeriod) {
    return res.status(400).json({ message: "Ange en kursperiod!" });
  }
  if (!Number.isInteger(parseInt(req.body.coursePeriod))) {
    return res
      .status(400)
      .json({ message: "Kursperioden ska vara ett heltal!" });
  }
  if (req.body.coursePeriod.length > 1) {
    return res
      .status(400)
      .json({ message: "Kursperioden ska vara endast ett heltal!" });
  }

  // Here we can start finding the course with ":id"
  // Store picked id
  const id = parseInt(req.params.id);
  let client;
  try {
    client = new MongoClient(mongoURL);
    await client.connect();
    const db = client.db(mongoDB);
    const col = db.collection(mongoCL);

    // Try update the document object whose "id:" is `req.params.id`
    // We use $set to set specific fields.
    const updateSingleCourse = await col.updateOne(
      { id: id },
      {
        $set: {
          courseId: req.body.courseId,
          courseName: req.body.courseName,
          coursePeriod: req.body.coursePeriod,
        },
      }
    );
    // If course was actually modified meaning it exist
    if (updateSingleCourse.modifiedCount > 0) {
      // Report when successfully updating course
      return res
        .status(200)
        .json({ message: `Kursen med id:${id} uppdaterad!` });
    } // Course doesn't exist!
    else {
      return res.status(404).json({
        message: `Kursen med id:${id} gick ej att uppdatera. Finns kanske ej?`,
      });
    }
  } catch (err) {
    // Catch and return 500 Internal Error if it happens!
    return res.status(500).json({
      message: "Misslyckades på serversidan att ändra kursen!",
    });
  } finally {
    // Always do this no matter what!
    client.close();
  }
});

// POST one new course
router.post("/courses", async (req, res) => {
  // Begin validating JSON Body data before accessing file:
  // Checks for courseId
  if (!req.body.courseId) {
    return res.status(400).json({ message: "Ange en kurskod!" });
  }
  const regex = /^[A-Z]{2}\d{3}[A-Z]$/; // FORMAT: Two uppercase letters then 3 digits and then one uppercase letter
  if (!regex.test(req.body.courseId)) {
    return res.status(400).json({
      message:
        "Kurskod ska vara i formatet: IK060G (två stora bokstäver, tre siffror och sedan en stor bokstav i slutet)!",
    });
  }
  // Checks for course name
  if (!req.body.courseName) {
    return res.status(400).json({ message: "Ange ett kursnamn!" });
  }
  if (req.body.courseName.length <= 10) {
    return res.status(400).json({ message: "Kursnamnet är för kort!" });
  }
  // Checks for course period
  if (!req.body.coursePeriod) {
    return res.status(400).json({ message: "Ange en kursperiod!" });
  }
  if (!Number.isInteger(parseInt(req.body.coursePeriod))) {
    return res
      .status(400)
      .json({ message: "Kursperioden ska vara ett heltal!" });
  }
  if (req.body.coursePeriod.length > 1) {
    return res
      .status(400)
      .json({ message: "Kursperioden ska vara endast ett heltal!" });
  }

  // If we are here, all JSON Body data is Validated so let's add to MongoDB!
  // Initiate connection and database name and its collection ("db=myCV", "col=courses")
  let client;
  let nextId = 1;
  try {
    client = new MongoClient(mongoURL);
    await client.connect();
    const db = client.db(mongoDB);
    const col = db.collection(mongoCL);

    // Find highest current value of `id` by sorting it from max value and just
    const highestIdCourse = await col.find().sort({ id: -1 }).limit(1).next();

    // If DOES exist then nextId is that plus one, otherwise it is the first course inserted!
    if (highestIdCourse) {
      nextId = highestIdCourse.id + 1;
    }

    // Then add the new course
    const addNewCourse = await col.insertOne({
      id: nextId,
      courseId: req.body.courseId,
      courseName: req.body.courseName,
      coursePeriod: req.body.coursePeriod,
    });

    // If success adding new course (acknowledged = true)
    if (addNewCourse.acknowledged) {
      // Report that when successful
      return res.status(200).json({ message: `En kurs har lagts till!` });
    } // Otherwise let user know it failed
    else {
      return res.status(500).json({
        message: "Misslyckades att lägga till kursen!",
      });
    }
  } catch (err) {
    // Catch and return 500 Internal Error if it happens!
    return res.status(500).json({
      message: "Misslyckades på serversidan att lägga till kursen!",
    });
  } finally {
    // Always do this no matter what!
    client.close();
  }
});

// This is the LAST one because if we have it before others it will be ran and stop the rest of the script!
// This is the "catch-all" responses for CRUD when someone is requesting something that does not exist.
router.get("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});
router.put("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});
router.post("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});
router.patch("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});
router.delete("/*", (req, res) => {
  res.status(404).json({
    message:
      "This endpoint does not exist or you lack the Authorita' to use request it!",
  });
});

// Export it so it can be used by `app.js` in root folder.
module.exports = router;
