import PastesDB from "../MongoDB_Models/pastes_model.js";

export const getThePaste = async (req, res) => {
  try {
    const pasteStatus = await PastesDB.findOne({ nan_id: req.params.nan_id });
    res.status(200).json(pasteStatus);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getPastesTotal = async (req, res) => {
  try {
    const pasteStatus = await PastesDB.find();
    res.status(200).json(pasteStatus);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const createThePaste = async (req, res) => {
  const newPaste = PastesDB(req.body);

  console.log(newPaste);

  try {
    // Check if ID already exists
    const pasteStatus = await PastesDB.findOne({ nan_id: req.body.nan_id });

    if (pasteStatus) {
      console.log("Exists");

      throw new Error("pasteid-exists");
    } else {
      await newPaste.save();

      res.status(201).json(newPaste);
    }
  } catch (error) {
    console.log(error);
    res.status(409).send(error.message);
  }
};
