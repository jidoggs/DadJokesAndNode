const fs = require("fs");
// const process = require("process");
const request = require("request");
const prompt = require("prompt");

prompt.start();
prompt.get(["term"], (err, result) => {
  if (err) {
    console.log(err.message);
  } else {
    const options = {
      url: `https://icanhazdadjoke.com/search?term=${result.term}`,
      headers: {
        Accept: "application/json",
      },
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        let resObj = JSON.parse(body);
        if (resObj.total_jokes < 1) {
          console.log(`No jokes are found with the word ${result.term}`);
        } else {
          let randomTitleJoke =
            resObj.results[Math.floor(Math.random() * resObj.total_jokes)];
          console.log(randomTitleJoke.joke);
          fs.open("jokes.txt", "a", (err, fd) => {
            if (err) {
              console.log("There was a problem with jokes.txt");
            } else {
              fs.write(
                fd,
                `${randomTitleJoke.joke} \r\n`,
                null,
                "utf8",
                (err, byteWritten) => {
                  if (err) {
                    console.log("there was an error writing to file");
                  }
                }
              );
            }
          });
        }
      }
    });
  }
});
