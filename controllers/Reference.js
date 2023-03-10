import References from '../models/referenceModel.js';
import { bucket } from '../middlewares/multer.js';
import streamifier from 'streamifier';

export const getReference = async (req, res) => {
  try {
    const reference = await References.findAll({
      attributes: ['id', 'reference_name', 'name', 'image'],
    });
    res.json(reference);
  } catch (error) {
    res.status(500).send(`Error, ${error}`);
  }
};

export const addReference = async (req, res) => {
  const { reference_name, name } = req.body;

  console.log(req.file);

  if (!req.file) {
    return res.status(404).send('Input image is not found!');
  }

  if (!name || !reference_name) {
    return res.status(404).send('All field must be filled!');
  }

  try {
    await References.create({
      reference_name: reference_name,
      name: name,
      image: `uploads/${req.file.filename}`,
    });
    res.status(201).send('New reference has been created!');
  } catch (error) {
    res.status(500).send(`Error, ${error}`);
  }
};

export const deleteReference = async (req, res) => {
  const findReference = await References.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!findReference) {
    return res.status(404).send('References is not found!');
  }

  try {
    await fs.unlink(path.join(`public/${findReference.image}`));
    await References.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({
      msg: 'References was deleted!',
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
