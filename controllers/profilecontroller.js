const router = require("express").Router();
const { ProfileModel, UserModel, JournalModel } = require("../models");

router.post("/new", async (req, res) => {
  const user = req.user;
  const { profile } = req.body;

  try {
    const { firstName, lastName, userName, phoneNumber, bio } = profile;

    let foundProfile = await ProfileModel.findOne({
      where: { userId: user.id },
    });

    if (foundProfile) {
      res.status(409).json({
        message: "Already associated Profile detected",
      });
    } else {
      await ProfileModel.create({
        firstName,
        lastName,
        userName,
        phoneNumber,
        bio,
        userId: user.id,
      });
      res.status(201).json({
        message: "Successful profile creation",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: `[Error:] ${error}`,
    });
  }
});

router.get("/myprofile", async (req, res) => {
  const user = req.user;

  try {
    const myProfile = await ProfileModel.findOne({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: UserModel,
          attributes: ["id", "email"],
          required: true, //this sets this and all matching children models to be an inner join
          include: [
            {
              model: JournalModel,
              // where: {
              //   userId: user.id,
              // },
              // required: true, //this resets the inner join requirement from earlier to a left outer join
            },
          ],
        },
      ],
    });
    // console.log("My Profile: ", myProfile)
    if (myProfile) {
      res.status(200).json({
        statusCode: 200,
        message: "Profile successfully retrieved",
        myProfile,
      });
    } else {
      res
        .status(404)
        .json({ message: "User does not have an associated profile" });
    }
  } catch (error) {
    res.status(500).json({
      error: `[Error:] ${error}`,
    });
  }
});

router.get("/lazyloading", async (req, res) => {
  const user = req.user;

  try {
    const myProfile = await ProfileModel.findOne({
      where: {
        userId: user.id,
      },
    });
    const userInfo = await UserModel.findOne({
      where: {
        id: user.id,
      },
    });
    const userJournals = await JournalModel.findAll({
      where: {
        userId: user.id,
      },
    });
    let responseObject = {
      profile: myProfile,
      emailAddress: userInfo.email,
      journals: userJournals,
    };
    // console.log("My Profile: ", myProfile)
    if (myProfile) {
      res.status(200).json({
        statusCode: 200,
        message: "Profile successfully retrieved",
        responseObject,
      });
    } else {
      res
        .status(404)
        .json({ message: "User does not have an associated profile" });
    }
  } catch (error) {
    res.status(500).json({
      error: `[Error:] ${error}`,
    });
  }
});

router.delete("/delete", async (req, res) => {
  const user = req.user;

  try {
    const foundProfile = await ProfileModel.findOne({
      where: {
        userId: user.id,
      },
    });
    if (foundProfile) {
      await foundProfile.destroy();
      res.status(200).json({
        message: "Successful profile delete",
      });
    } else {
      res.status(404).json({
        message: "User does not have an associated profile",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: `[Error:] ${error}`,
    });
  }
});

router.put("/update", async (req, res) => {
  const user = req.user;
  const { profile } = req.body;

  try {
    const foundProfile = await ProfileModel.findOne({
      where: {
        userId: user.id,
      },
    });
    if (foundProfile) {
      await foundProfile.update(profile);
      res.status(200).json({
        message: "Successful profile update",
      });
    } else {
      res.status(404).json({
        message: "User does not have an associated profile",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: `[Error:] ${error}`,
    });
  }
});

module.exports = router;

