

const dotenv = require("dotenv");
dotenv.config();
const { TwitterClient } = require("twitter-api-client");
const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
// to bypass heroku port issue
const http = require("http");

const twitterClient = new TwitterClient({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_SECRET,
});

async function get_followers() {

  /*---------------UPDATE LOCATION PROFIL---------------------*/


  const follower = await twitterClient.accountsAndUsers.usersShow({
    screen_name: process.env.SCREEN_NAME
  });

  let location = []

  if(follower.followers_count< 100){
    location.push("0 ")
    let greencube = Math.floor(follower.followers_count/ 20)
    console.log(greencube)
    let cube = 0
    if(greencube > 0){
      for(let i = 0; i < greencube; i++){
        location.push("🟩")
        cube ++
      }
      if(follower.followers_count- (greencube * 20) > 0){
        location.push("🟨")
        cube ++

        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      } else {
        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      }
    } else {
      if(follower.followers_count/ 20 > 0){
        location.push("🟨")
        cube ++
        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      } else {
        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      }
    }
    location.push(" 100 followers")
  } else if(follower.followers_count>= 100 && follower.followers_count< 1000){
    location.push("100 ")

    let greencube = Math.floor(follower.followers_count/ 200)
    console.log(greencube)
    let cube = 0
    if(greencube > 0){
      for(let i = 0; i < greencube; i++){
        location.push("🟩")
        cube ++
      }
      if(follower.followers_count- (greencube * 200) > 0){
        location.push("🟨")
        cube ++

        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      } else {
        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      }
    } else {
      if(follower.followers_count/ 200 > 0){
        location.push("🟨")
        cube ++
        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      } else {
        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      }
    }
    location.push(" 1k followers")

    /*----------------*/ 

} else if(follower.followers_count>= 1000){

  let number = Math.floor(follower.followers_count/ 1000)

  location.push(`${number}k `)
  
    let greencube = Math.floor((follower.followers_count - (number*1000))/ 200)
    console.log(greencube)
    let cube = 0
    if(greencube > 0){
      for(let i = 0; i < greencube; i++){
        location.push("🟩")
        cube ++
      }
      if(follower.followers_count- (greencube * 200) > 0){
        location.push("🟨")
        cube ++

        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      } else {
        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      }
    } else {
      if((follower.followers_count - (number*1000))/ 200 > 0){
        location.push("🟨")
        cube ++
        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      } else {
        while(cube < 5){
          location.push("⬜️")
          cube ++
        }
      }
    }
    location.push(` ${number + 1}k followers`)
}

  const update = await twitterClient.accountsAndUsers.accountUpdateProfile({
    location: location.join("")
  });





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

get_followers();

setInterval(() => {
  get_followers();
}, 60000);
