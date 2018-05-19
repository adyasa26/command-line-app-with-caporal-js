#!/usr/bin/env node

const prog = require('caporal');
const ip = require('ip');
const getIP = require('external-ip')();
const request = require('request');
const cheerio = require('cheerio');
prog
  .version('1.0.0')
  //======================== 1 ===========================//
  // lowercase
  .command('lowercase','number 1')
  .argument('<string>', 'input argumen to be lowecase')
  .action((args, options, logger)=> {
    var str = args.string.toLowerCase();
    logger.info(str) 
  })
  // uppercase
  .command('uppercase','number 1')
  .argument('<string>','input argumen to be uppercase')
  .action((args, options, logger)=>{
    let str = args.string.toUpperCase();
    logger.info(str)
  })
  //capitalize
  .command('capitalize', 'number 1')
  .argument('<string>','input argument to be capitalize')
  .action((args, options, logger)=>{
    let str = args.string.split(' ')
    str = str.map(kata =>{ 
      kata = kata.charAt(0).toUpperCase() + kata.slice(1)
      return kata
    })
    logger.info(str.join(' '))
  })


  //======================== 2 ===========================//
  // add
  .command('add')
  .argument('[num...]')
  .action((args, options, logger)=>{
    let total = args.num[0]
    for(let i=1;i<args.num.length;i++){
        total+=parseInt(args.num[i])
  }
  console.log(total)
  })

  // subtract
  .command('subtract')
  .argument('[num...]')
  .action((args, options, logger)=>{
    let total = args.num[0]
    for(let i=1;i<args.num.length;i++){
        total-=parseInt(args.num[i])
  }
  console.log(total)
  })

  // multiply
  .command('multiply')
  .argument('[num...]')
  .action((args, options, logger)=>{
    let total = args.num[0]
    for(let i=1;i<args.num.length;i++){
        total*=parseInt(args.num[i])
  }
  console.log(total)
  })

  // divide
  .command('divide')
  .argument('[num...]')
  .action((args, options, logger)=>{
    let total = args.num[0]
    for(let i=1;i<args.num.length;i++){
        total/=parseInt(args.num[i])
  }
  console.log(total)
  })

//======================== 3 ===========================//
  .command('palindrome')
  .argument('[str...]')
  .action ((args, options, logger)=>{
    let kata = ()=>{
      return args.str === args.str.reverse().join('') ? 'Is palindrome? Yes' : 'Is palindrome? No'; }
    let pal = kata()
    console.log('String : '+ args.str);
    console.log(pal);
  })
  
 //======================== 4 ===========================//
 .command('obfuscator')
 .argument('<string>')
 .action((args, options, logger)=>{
  let result = "", code; 
  let str = args.string
  for(let i=0; i<str.length; i++){
    result += '&#'+str[i].charCodeAt()+';'
  }
  console.log("&#"+result+";");
 })

 //======================== 5 ===========================//
.command('random', 'random command')
.option('--length','untuk kondisi',prog.INT,62) // nilai 62 memberi default value karna options length digunakan dalam sebuah fungsi
.option('--letters','letter',prog.BOOL)
.option('--numbers','number',prog.BOOL)
.option('--uppercase','uppercase',prog.BOOL)
.option('--lowercase','lowercase',prog.BOOL)
.action(function(args, options, logger){
   
  function randomChar() {
      let text = "";
      let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      if(options.letters==false){
          char = char.replace(/[^0-9]/g,'') // skema pada replace : (regex,'destination replace')
      }else if(options.numbers==false){
          char = char.replace(/[^a-zA-Z]/g,'') 
      }else if(options.lowercase){
          char = char.replace(/[^a-z0-9]/g,'')
      }else if(options.uppercase){
              char = char.replace(/[^A-Z0-9]/g,'')
      }
      // jika hanya memanggil random saja maka perintah for saja yang akan jalan
      for (let i = 0; i < options.length; i++)
          text += char.charAt(Math.floor(Math.random() * 62)); // random akan mengembalikan nilai secara rundom sesuai range (* range)
          return text;
  }    
console.log(randomChar())      
})

//======================== 6 ===========================//
.command('ip')
.action((args, options, logger)=> {
  logger.info(ip.address('private',"ipv4"))
})

//======================== 7 ===========================//
.command('ip-external')
.action((args, options, logger)=> {
  getIP((err, ip) => {
    if (err) {
        // every service in the list has failed
        throw err;
    }
    console.log(ip);
});
})

//======================== 8 ===========================//
.command('headline')
.action((args, options, logger)=> {
  request('https://www.kompas.com/',(error, response,body)=>{ // request is javascript request
    const $ = cheerio.load(body); // cheerio scraping html
    $('a.headline__thumb__link').each(function(i,elements){ // 'a' is a tag, headline...is class name of tag 'a'
      console.log('Title: '+$(this).children().text()) // use children() cause <h2>text are inside 'a' tag 
      console.log('URL : '+$(this).attr('href'))
      console.log('\n')
      
    })
  })
})

//======================== 12 ===========================//
.command('movies')
.action((args, options, logger)=>{
  request('https://cgv.id/en/movies/now_playing',(function(error,response,body){
    const $ = cheerio.load(body);
    $('div.movie-list-body ul li a').each(function(i,elements){
      let url = 'https://cgv.id'+$(this).attr('href')
      //console.log(url);      
      //for(let i=0;i>url.length;i++)
        request(url,(err,res,html)=>{
          const $ = cheerio.load(html)
          $('div.synopsis-section div.movie-add-info ul li').each(function(i,elements){
            console.log($(this).text())            
          }) // each
          $('div.synopsis-section div.movie-synopsis').each(function(i,elements){
            console.log($(this).text())            
          })
          console.log('\n')
          console.log('--------------------------------------------------------------------------------------------')
          console.log('\n')
        })// request 2

      //} // for

    }// $

  )}) // end of request 1

)})// end of action


prog.parse(process.argv);
 
// ./myprog deploy myapp production --tail 100