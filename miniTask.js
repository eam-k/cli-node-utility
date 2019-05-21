const fs = require('fs');
const file = fs.createWriteStream('./file4Big.txt');
for(let i = 0; i<= 0.1e6 ;i++ ){
    file.write('This is a big file, very very big\n');
    file.write('big big big big\n');
}
file.end();