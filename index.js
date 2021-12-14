const express = require("express");

const port = 3000;

const app = express();

app.use(express.json());

const hewan = [
  { id: 1, nama: "Snowy", spesies: "kucing" },
  { id: 2, nama: "Blacki", spesies: "anjing" },
  { id: 3, nama: "Molly", spesies: "kucing" },
  { id: 4, nama: "Milo", spesies: "kelinci" },
  { id: 5, nama: "Rere", spesies: "kucing" },
];

//logger middleware
const logger = (req, res, next) => {
  console.log("ini middleware");
  return next();
  // console.log("tes") nyoba buat return next()
};

//fungsi kalo masukinny gabener
const selain = (req, res) => {
  res.status(404).send({
    error: "spesiesnya yang bener",
  });
};

//ambil semua
app.get("/hewan", logger, (req, res, next) => {
  try {
    res.send({
      message: "ok bisa",
      hewan: hewan,
    });
    // next()
  } catch (error) {
    res.status(500).send(error);
  }
});

//ambil hewan pake id
app.get("/hewan/:id", logger, (req, res) => {
  try {
    const filteredData = hewan.find((u) => u.id === Number(req.params.id));

    if (filteredData) {
      res.status(200).send({
        message: "ok bisa",
        hewanFilter: [filteredData],
      });
    } else {
      res.status(404).send({
        message: "gada",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

//post hewan
app.post(
  "/hewan",
  logger,
  (req, res, next) => {
    try {
      const body = req.body;

      const newData = {
        id: hewan.length + 1,
        nama: body["nama"],
        spesies: body["spesies"],
      };

      if (
        newData.spesies === "kucing" ||
        newData.spesies === "anjing" ||
        newData.spesies === "kelinci"
      ) {
        hewan.push(newData);
        res.status(201).send({
          message: "ok bisa",
          hewan: hewan,
        });
      } else next();
    } catch (error) {
      res.status(500).send(error);
    }
  },
  selain
);

//update
app.put(
  "/hewan/:id",
  logger,
  (req, res, next) => {
    try {
      console.log(req.body, "+++++++");
      const body = req.body;
      const index = hewan.findIndex((u) => u.id === Number(req.params.id));
      const index2 = hewan.filter((u) => u.id === Number(req.params.id));
      console.log(index2[0], "=======");
      console.log(index);
      const updatedData = { id: Number(req.params.id), ...body };

      if (
        updatedData.spesies === "kucing" ||
        updatedData.spesies === "anjing" ||
        updatedData.spesies === "kucing"
      ) {
        hewan[index] = updatedData;
        res.status(201).send({
          message: "success updated",
          hewan: hewan,
        });
      } else {
        next();
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  selain
);

//delete hewan pake id
app.delete("/hewan/:id", logger, (req, res) => {
  try {
    const index = hewan.findIndex((u) => u.id === Number(req.params.id));
    const deletedData = hewan.splice(index, 1);

    res.status(200).send({
      message: "ok bisa",
      deletedHewan: deletedData,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log("listening at port 3000");
});
