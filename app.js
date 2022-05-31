const express = require("express");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const sw = require("stopword");
const { removeStopwords } = require("stopword");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

const PORT = process.env.PORT || 3000;

// Reading all the required text files and splitting them into array of string
titles = [];
let reading = fs.readFileSync("./Titles.txt", {encoding: "utf-8",flag: "r"});
titles = reading.split(/\r?\n/);

URLs = [];
reading = fs.readFileSync("./Problems_urls.txt", {encoding: "utf-8",flag: "r"});
URLs = reading.split(/\r?\n/);

Magnitude = [];
reading = fs.readFileSync("./Magnitude.txt", {encoding: "utf-8",flag: "r"});
Magnitude = reading.split(/\r?\n/);
Magnitude.splice(-1);

Keywords = [];
reading = fs.readFileSync("./Keywords.txt", {encoding: "utf-8", flag: "r"});
Keywords = reading.split(/\r?\n/);

IDF = [];
reading = fs.readFileSync("./IDF.txt", {encoding: "utf-8",flag: "r"});
IDF = reading.split(/\r?\n/);
IDF.splice(-1);

Imp = [];
reading = fs.readFileSync("./TFIDF.txt", {encoding: "utf-8", flag: "r"});
Imp = reading.split(/\r?\n/);
Imp.splice(-1);

for (let i = 0; i < Imp.length; i++) {
  Imp[i] = Imp[i].split(" ");
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/search", (req, res) => {
  const query = req.query;
  let question = query.question;

  let query_keywords = [];
  question = question.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  question = question.toLowerCase();
  query_keywords = question.split(" ");
  query_keywords = removeStopwords(query_keywords);
  query_keywords = query_keywords.sort();
  
  let query_TF = [];

  for (let i = 0; i < Keywords.length; i++) {
    let cnt = query_keywords.filter((x) => x === Keywords[i]).length;
    if (cnt == 0) continue;

    tf_local = [];
    tf_local.push(0);
    tf_local.push(i);
    tf_local.push(cnt / query_keywords.length);
    query_TF.push(tf_local);
  }

  let query_Imp = [];

  for (let i = 0; i < query_TF.length; i++) {
    Imp_Mat = [];
    Imp_Mat.push(query_TF[i][0]);
    Imp_Mat.push(query_TF[i][1]);
    Imp_Mat.push(query_TF[i][2] * parseFloat(IDF[query_TF[i][1]]));
    query_Imp.push(Imp_Mat);
  }

  let query_magnitude = 0.0;

  for (let i = 0; i < query_Imp.length; i++) {
    query_magnitude +=
      query_Imp[i][2] * query_Imp[i][2];
  }

  query_magnitude = Math.sqrt(query_magnitude);

  let similarity = [];

  for (let i = 0; i < Magnitude.length; i++) {
    sim = [];
    sim.push(0.0);
    sim.push(i);
    similarity.push(sim);
  }

  for (let i = 0; i < query_Imp.length; i++) {
    let toCheckKwd = query_Imp[i][1];
    for (let j = 0; j < Imp.length; j++) {
      if (parseInt(Imp[j][1]) == toCheckKwd) {
        similarity[parseInt(Imp[j][0])][0] +=
          query_Imp[i][2] * parseFloat(Imp[j][2]);
      }
    }
  }

  for (let i = 0; i < Magnitude.length; i++) {
    similarity[i][0] =
      similarity[i][0] / (parseFloat(Magnitude[i]) * query_magnitude);
  }
  similarity = similarity.sort().reverse();

  arr = [];
  arr_title = [];

  for (let i = 0; arr.length != 5; i++) {
    ques_details = [];
    ques_no = similarity[i][1];

    let flag = 0;

    for(let j = 0; j < arr_title.length; j++){
      if(arr_title[j] == titles[ques_no]){
        flag = 1;
        break;
      }
    }
    if(flag == 1){
      continue;
    }

    arr_title.push(titles[ques_no]);
    ques_details.push(titles[ques_no]);
    ques_details.push(URLs[ques_no]);

    filereading = fs.readFileSync(
      "./Problems/problem-" + (ques_no + 1).toString() + ".txt",
      { encoding: "utf-8", flag: "r" }
    );
    filereading = filereading.replace(/\\n/g, " ");

    if (filereading.length > 200) ques_details.push(filereading.slice(2, 200));
    else ques_details.push(filereading.slice(2, -1));
    arr.push(ques_details);
  }

  res.json(arr);
});

app.listen(PORT, () => {
  console.log("I am on PORT no. " + PORT);
});