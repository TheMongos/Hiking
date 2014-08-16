/*--------------------------------------------------------------------------------------------------------------------*/
// In this app an array will be our database 


    var students = [
    {
		id:1,
        name: "Bibi Netaniou",
        year: "2010",
        country: "USA",
        picture: "israel1.jpg"
    },
    {	
		id:2,
        name: "Yair Lapid",
        year: "2011",
        country: "Israel",
        picture: "roi1.jpg"
    },
    {
		id:3,
        name: "Naftali Benet",
        year: "2009",
        country: "Israel",
        picture: "Ido1.jpg"
    },
    {
		id:4,
        name: "Shelly Yehimoziyz",
        year: "2011",
        country: "Israel",
        picture: "itamar1.jpg"
    }];

//find student by id
function find(id)
{
for (var i=0;i<students.length;i++)
		if (students[i].id == id)
		{
			console.log("students["+i+"].id="+students[i].id );
			return students[i];
		}
		return null;
}
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving student: ' + id);
	var st = find(id);
	if (st != null)
		res.send(JSON.stringify(st));
	else
		res.send(JSON.stringify(""));
};

exports.findAll = function(req, res) {
    console.log("findAll");
	res.send(JSON.stringify(students));
 
};

exports.addStudent = function(req, res) {
    var student = req.body;
	console.log("addStudent req.body="+student);
	students.push(student);
    console.log('Adding student: ' + JSON.stringify(student));
	res.send(JSON.stringify(student));
}

exports.updateStudent= function(req, res) {
    var id = req.params.id;
    var student = req.body;
	var st = find(id);
	if (st !=null)
	{
		st.name  = req.params.name;
        st.year = req.params.year;
        st.country = req.params.country;
        st.picture = req.params.picture;
		console.log('Updating student: ' + id);
		console.log(JSON.stringify(st));
		res.send(JSON.stringify(st));
   }
   else
   {
		 console.log('Error updating student: ' + id);
         res.send({'error':'An error has occurred'});
	}
   
}

exports.deleteStudent = function(req, res) {
    var id = req.params.id;
    console.log('Deleting student: ' + id);
	if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }

    
}

