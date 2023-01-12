const dotenv = require("dotenv");
dotenv.config();
const { TwitterClient } = require("twitter-api-client");
const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
// to bypass heroku port issue
const http = require("http");
const Express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

const app = new Express();
app.use(cors())

const twitterClient = new TwitterClient({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_SECRET,
});

/**
 * Abbreviates an integer with k, M or B abbreviation
 * @param {number} int Integer to abbreviate
 * @returns {string} Abbreviated integer
 */

const abbreviateInt = (int) => {
  if (int < 1000) return int.toString();

  const numOfDigits = int.toString().length;
  const unit = numOfDigits - (numOfDigits % 3 || 3);

  return Math.floor(int / Math.pow(10, unit)) + " kMB"[unit / 3];
};

/**
 * Get previous checkpoint from a number (for example: 120 => 100, 12732 => 12000)
 * @param {number} int
 * @returns {number}
 */

const previousCheckpoint = (int) => {
  if (int < 100) return 0;

  if (int < 1000) return Math.floor(int / 100) * 100;

  const numOfDigits = int.toString().length;
  const num = Math.floor(
    int / Math.pow(10, numOfDigits - (numOfDigits % 3 || 3))
  );

  return num * Math.pow(10, numOfDigits - num.toString().length);
};

/**
 * Get next checkpoint from a number (for example: 120 => 200, 12732 => 13000)
 * @param {number} int
 * @returns {number}
 */

const nextCheckpoint = (int) => {
  if (int < 100) return 100;

  if (int < 1000) return (Math.floor(int / 100) + 1) * 100;

  const numOfDigits = int.toString().length;
  const num = Math.floor(
    int / Math.pow(10, numOfDigits - (numOfDigits % 3 || 3))
  );

  return (num + 1) * Math.pow(10, numOfDigits - num.toString().length);
};

/**
 * Get followers progress bar
 * @param {number} followersCount
 * @returns {string}
 */

const getFollowersProgress = (followersCount) => {
  const prev = previousCheckpoint(followersCount);
  const next = nextCheckpoint(followersCount);

  const greenCubes = "🟩".repeat(
    Math.floor((followersCount - prev) / ((next - prev) / 5))
  );
  const yellowCube =
    ((followersCount - prev) / ((next - prev) / 5)) % 1 !== 0 ? "🟨" : "";
  const cubes = (greenCubes + yellowCube).padEnd(10, "⬜️");

  return `${abbreviateInt(prev)} ${cubes} ${abbreviateInt(next)} followers`;
};

async function get_followers() {
  /*---------------UPDATE LOCATION PROFIL---------------------*/

  try {
    const follower = await twitterClient.accountsAndUsers.usersShow({
      screen_name: process.env.SCREEN_NAME,
    });

    const location = getFollowersProgress(follower.followers_count);

    const update = await twitterClient.accountsAndUsers.accountUpdateProfile({
      location,
    });
  } catch (err) {
    console.error(err);
  }

  /*---------------UPDATE PROFIL PICTURE---------------------*/
  const followers = await twitterClient.accountsAndUsers.followersList({
    count: 3,
  });

  const image_data = [];
  let count = 0;

  const get_followers_img = new Promise((resolve, reject) => {
    followers.users.forEach((follower, index, arr) => {
      process_image(
        follower.profile_image_url_https,
        `${follower.screen_name}.png`
      ).then(() => {
        const follower_avatar = {
          input: `${follower.screen_name}.png`,
          top: parseInt(`${380 + 300 * index}`),
          left: 3950,
        };
        image_data.push(follower_avatar);
        count++;
        if (count === arr.length) resolve();
      });
    });
  });

  get_followers_img.then(() => {
    draw_image(image_data);
  });
}

async function process_image(url, image_path) {
  await axios({
    url,
    responseType: "arraybuffer",
  }).then(
    (response) =>
      new Promise(async (resolve, reject) => {
        const rounded_corners = new Buffer.from(
          '<svg><rect x="0" y="0" width="250" height="250" rx="125" ry="125"/></svg>'
        );
        resolve(
          sharp(response.data)
            .resize(250, 250)
            .composite([
              {
                input: rounded_corners,
                blend: "dest-in",
              },
            ])
            .png()
            .toFile(image_path)
        );
      })
  );
}

async function draw_image(image_data) {
  try {
    await sharp("twitter-banner.png")
      .composite(image_data)
      .toFile("new-twitter-banner.png");

    upload_banner(image_data);
  } catch (error) {
    console.log(error);
  }
}

async function upload_banner(files) {
  try {
    const base64 = fs.readFileSync("new-twitter-banner.png", {
      encoding: "base64",
    });
    await twitterClient.accountsAndUsers
      .accountUpdateProfileBanner({
        banner: base64,
      })
      .then(() => {
        console.log("Upload to Twitter done");
        delete_files(files);
      });
  } catch (error) {
    console.log(error);
  }
}

async function delete_files(files) {
  try {
    files.forEach((file) => {
      if (file.input.includes(".png")) {
        fs.unlinkSync(file.input);
        console.log("File removed");
      }
    });
  } catch (err) {
    console.error(err);
  }
}

app.listen(PORT, () => {
  console.log(`Server started on port 8000`);
  setInterval(() => {
    get_followers();
    console.log("start")
  }, 60000);
});
