// // WITHOUT PYTHON

// const express = require("express");
// const ejs = require("ejs");
// const path = require("path");
// const fs = require("fs");
// const { removeStopwords } = require("remove-stopwords");

// const app = express();

// app.set("view engine", "ejs");

// app.use(express.json());

// app.use(express.static(path.join(__dirname, "/public")));

// const PORT = 3000;

// let Magnitude = [];
// let readMag = fs.readFileSync('./Magnitude.txt',{encoding:'utf8', flag:'r'});
  
// Magnitude = readMag.split(/\r?\n/);
// Magnitude.pop();

// let titles = [];
// let readTitle = fs.readFileSync('./Titles.txt',{encoding:'utf8', flag:'r'});

// titles = readTitle.split(/\r?\n/);

// let URLs = [];
// let readURLs = fs.readFileSync('./Problems_urls.txt',{encoding:'utf8', flag:'r'});

// URLs = readURLs.split(/\r?\n/);

// // READ Keywords
// let keywords = [];
// let readKwd = fs.readFileSync('./Keywords.txt',{encoding:'utf8', flag:'r'});
// keywords = readKwd.split(/\r?\n/);

// // # READ IDF
// let IDF = [];
// let readIdfs = fs.readFileSync('./IDF.txt',{encoding:'utf8', flag:'r'});
// IDF = readIdfs.split(/\r?\n/);
// IDF.pop();

// // # READ Importance Matrix
// Importance_Matrix = [];
// let readImp = fs.readFileSync('./TFIDF.txt',{encoding:'utf8', flag:'r'});
// Importance_Matrix = readImp.split(/\r?\n/);
// Importance_Matrix.pop();

// app.get("/", (req, res) => {
//   res.render("index");
// });

// app.get("/search", (req, res) => {
//   const query = req.query;
//   let question = query.question;

//   let query_keywords = [];
//   question = question.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
//   question = question.toLowerCase();
//   query_keywords = question.split(" ");
//   query_keywords = removeStopwords(query_keywords);

//   query_keywords = query_keywords.sort();

//   let query_TF = [];
//   for(let i = 0; i < keywords.length; i++){
//     let cnt = query_keywords.filter((x) => x == keywords[i]).length;
//     if(cnt == 0)
//       continue;

//     tf_local = [];
//     tf_local.push(0);
//     tf_local.push(i);
//     tf_local.push(cnt/query_keywords.length);
//     query_TF.push(tf_local);
//   }

//   let query_imp = [];

//   for(let i = 0; i < query_TF.length; i++){
//     imp_mat = [];
//     imp_mat.push(query_TF[i][0]);
//     imp_mat.push(query_TF[i][1]);
//     imp_mat.push(query_TF[i][2]*parseFloat(IDF[query_TF[i][1]]));
//     query_imp.push(imp_mat);
//   }

//   let query_mag = 0.0;
//   for(let i = 0; i < query_imp.length; i++){
//     query_mag+=query_imp[i][2]*query_imp[i][2];
//   }
//   query_mag = Math.sqrt(query_mag);

//   let similarity = [];

//   for(let i = 0; i < Magnitude.length; i++){
//     sim = [];
//     sim.push(0.0);
//     sim.push(i);
//     similarity.push(sim);
//   }

//   for(let i = 0; i < query_imp.length; i++){
//     let toCheckKwd = query_imp[i][1];
//     for(let j = 0; j < Importance_Matrix.length; j++){
//       if(parseInt(Importance_Matrix[j][1]) == toCheckKwd){
//         similarity[parseInt(Importance_Matrix[j][0])][0] +=query_imp[i][2]*parseFloat(Importance_Matrix[j][2]);
//       }
//     }

//   }

//   for(let i = 0; i < Magnitude.length; i++){
//     similarity[i][0] = similarity[i][0]/(parseFloat(Magnitude[i])*query_mag);
//   }

//   similarity = similarity.sort().reverse();

//   let answer = [];

//   let cnt = 0;
//   while (cnt < 5){
//     idx = similarity[cnt][1];
//     arr = [];
//     arr.push(titles[idx]);
//     arr.push(URLs[idx]);

//     let f1 = fs.readFileSync('Problems/problem-'+String(cnt+1)+'.txt', {encoding:'utf8', flag:'r'});
//     f1 = f1.replace(/\\n/g, " ");
//     arr.push(f1.slice(0,100));

//     answer.push(arr);
    
//   }

//   res.json(answer);
// });

// app.listen(3000, () => {
//   console.log("Listening on port no. " + PORT);
// });

// // Sum of numbers in a grid


// WITH PYTHON

const express = require("express");
const ejs = require("ejs");
const path = require("path");
const spawn = require("child_process").spawn;
const {removeStopwords} = require("remove-stopwords");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

const PORT = process.ene.port || 3000;


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/search", (req, res) => {
  const query = req.query;

  const question = query.question;

  const childPython = spawn("python", ["./GenerateTopQuestions.py", question]);
  childPython.stdout.on("data", function (data) {

    var data_str = data.toString();
    var arr = data_str.split("'], ['");

    var l = arr.length;

    arr[0] = arr[0].slice(3);

    arr[l - 1] = arr[l - 1].slice(0, -5);

    var str_arr = [];

    for (let i = 0; i < l; i++) {
      let arr_next_split = [];
      arr_next_split = arr[i].split("', '");
      str_arr.push(arr_next_split);
    }

    res.json(str_arr);
  });

  childPython.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

});

app.listen(PORT, () => {
  console.log("I am on PORT no. " + PORT);
});