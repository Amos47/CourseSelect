/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var courseList;

$(document).ready( function(){
   $('.menuButton').mouseover( function(){
       $(this).stop().animate({
           left: '-20px'
       }, 200);
   }).mouseleave( function() {
       $(this).stop().animate({
           left: '0px'
       }, 200);
   }); 
});

window.onload = function() {
    courseList = retrieveCourseListFromCookie();
    if (courseList) {
        for (var i = 0; i < courseList.length; i++) {
            if (courseList[i] !== null && courseList[i].code !== "" && courseList[i].code !== null) {
                addCourseToDisplay(courseList[i]);
            }
        }
    }
    else {
        courseList = new Array();
    }
    loadAllPrerequisitsFromCookie();


};

function Course(code, isElective, isCompleted, inProgress, inMajor, inMinor)
{
    var course = new Object();
    course.code = code;
    course.isElective = isElective;
    course.isCompleted = isCompleted;
    course.inProgress = inProgress;
    course.inMajor = inMajor;
    course.inMinor = inMinor;
    course.prereq = new Array();
    return course;

}

function addCourse()
{
    var code = document.forms["addClass"]["courseCode"].value;
    code = code.toString().replace(/ /g, "").toUpperCase();
    var isElective = false;
    var isCompleted = false;
    var inProgress = false;
    var inMajor = false;
    var inMinor = false;


    var classTypes = document.getElementsByName('courseType');
    var selectedType;
    for (var i = 0; i < classTypes.length; i++) {
        if (classTypes[i].checked)
            selectedType = classTypes[i].value;
    }

    switch (selectedType) {
        case "Major":
            inMajor = true;
            break;
        case "Minor":
            inMinor = true;
            break;
        case "Elective" :
            isElective = true;
            break;
        default:
            break;
    }

    var progressStages = document.getElementsByName('completed');
    var selectedProgress;
    for (var i = 0; i < progressStages.length; i++) {
        if (progressStages[i].checked) {
            selectedProgress = progressStages[i].value;
        }
    }
    if (selectedProgress === "Yes") {
        isCompleted = true;
    }
    else if (selectedProgress === "InProgress") {
        inProgress = true;
    }

    //create a course
    var c = new Course(code, isElective, isCompleted, inProgress, inMajor, inMinor);
    for (var i = 0; i < courseList.length; i++) {
        //check that it's not 
        if (courseList[i].code === c.code) {
            alert("You've already added that course code");
            return false;
        }
    }
    courseList.push(c);
    addCourseToDisplay(c);
    saveClassesToCookie();
    resetAddClientFormToDefaults();
    return false;
}

function removeSelectedPrereqOption(){
    var selectBox = document.getElementById('selectPrereq');
    var list = new Array();
    for(var i = 0; i < courseList[i]; i++){
        if(getSelectedCourse().prereq.indexOf(courseList[i]) === -1){
            list.push(courseList[i]);
        }
    }
    updateSelectBox(selectBox, list);
}

function resetAddClientFormToDefaults() {
    document.getElementById("addClass").reset();
}

function addCourseToDisplay(c) {

    var displayList = document.getElementById("classList");
    var listElement = document.createElement('li');
    var s = c.code + ".";
    if (c.isCompleted) {
        s += " Completed.";
    }
    else if (c.inProgress) {
        s += " In Progress.";
    }
    else {
        s += " Incomplete.";
    }
    if (c.inMajor) {
        s += " Part of Major.";
    }
    else if (c.inMinor) {
        s += " Part of Minor.";
    }
    else {
        s += " Elective";
    }
    var txt = document.createTextNode(s);
    listElement.appendChild(txt);
    listElement.className = 'courseList';
    listElement.addEventListener('click', clickList, false);
    displayList.insertBefore(listElement, displayList.firstChild);

}

function saveClassesToCookie() {
    //save all classes
    for (var i = 0; i < courseList.length; i++) {
        saveClassToCookie(courseList[i]);
    }

    //update coursecodes map
    updateCourseCodes();
}
function updateCourseCodes() {
    deleteCookie('courseCodes');
    var value = "";
    for (var i = 0; i < courseList.length - 1; i++) {
        value += courseList[i].code + ",";
    }
    if (courseList.length > 0) {
        value += courseList[courseList.length - 1].code;
    }
    saveCookie("courseCodes", value, 60);
}
function saveCookie(key, value, expDays) {
    var expDate = new Date();
    expDate.setDate(expDate.getDate() + expDays);
    var str = key + "=" + value;
    if (expDays !== 0) {
        str += ";expires=" + expDate.toUTCString();
    }
    str += ";";
    //look here of only one class is showing
    document.cookie = str;
}

function saveClassToCookie(course) {
    //code, isElective, isCompleted, inProgress, inMajor, inMinor
    var str = course.code + ",";
    str += course.isElective ? "1," : "0,";
    str += course.isCompleted ? "1," : "0,";
    str += course.inProgress ? "1," : "0,";
    str += course.inMajor ? "1," : "0,";
    str += course.inMinor ? "1," : "0,";
    //TODO: save the prerequisits
    saveCookie(course.code, str, 60);
}

//creates a course object from the value string
function courseFromValue(value) {
    var prop = value.split(",");
    for (var i = 1; i < prop.length; i++) {
        if (prop[i] === "1") {
            prop[i] = true;
        }
        else {
            prop[i] = false;
        }
    }
    return Course(prop[0], prop[1], prop[2], prop[3], prop[4], prop[5]);
}

function getCourseCodes() {
    var value = getCookieValue("courseCodes");
    if (value === null) {
        console.log("courseCodes cookie is null");
        return "";
    }
    return value.split(",");
}

//make an array of course objects from a cookie
function retrieveCourseListFromCookie() {
    var courses = new Array();
    var courseCodes = getCourseCodes();
    if (courseCodes === "") {
        console.log("returned null courseListFromCookie");
        return null;
    }
    for (var i = 0; i < courseCodes.length; i++) {
        var value = getCookieValue(courseCodes[i]);
        if (value !== null) {
            var c = courseFromValue(value);
            courses.push(c);
        }
    }
    return courses;
}

function removeCourse(code) {
    for (var i = 0; i < courseList.length; i++) {
        if (code === courseList[i].code) {
            deleteCookie(code);
            courseList.splice(i, 1);
        }
    }
}

function removeElementFromScreen(element) {
    element.parentNode.removeChild(element);
}

function removeSelectedElements() {
    //get array of selected elements
    var courses = document.getElementsByClassName('highlighted');
    //remove each item of array
    while (courses.length > 0) {
        var innerStr = courses[0].innerHTML;
        var code = innerStr.substring(0, innerStr.indexOf("."));
        removeCourse(code);
        removeElementFromScreen(courses[0]);
    }
    updateCourseCodes();


}

function deleteCookie(key) {
    document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//get a cookie value string with key. can return null if not found
function getCookieValue(key) {
    var cook = document.cookie;
    //find key
    var start = cook.indexOf(key + "=");
    if (start === -1) {
        start = cook.indexOf("" + key + " =");
    }
    if (start === -1) {
        start = cook.indexOf(" " + key + "=");
    }
    //return null if cant find index
    if (start === -1) {
        console.log("couldn't find " + key);
        return null;
    }
    //reset start to 1 past = sign after key
    start = cook.indexOf("=", start) + 1;
    //end = first ; after start or end if not found
    var end = cook.indexOf(";", start);
    if (end === -1) {
        end = cook.length;
    }
    return  cook.substring(start, end);
}

function getNewOrderID(){
    //try and load from cookie
    var newID = parseInt(getCookieValue('num_order_ids'));
    if(newID === null){
        newID = 0;
    }
    else{
        newID++;
    }
    //save number to cookie
    saveCookie('num_order_ids', "" + newID, 60);
    return newID;
}

//toggles the clicked list item to the highlighted class
function clickList() {
    if (this.className === 'highlighted') {
        this.className = null;
    }
    else {
        this.className = 'highlighted';
    }
}
/*
 * not needed copied from web
 function setCursorByID(id,cursorStyle) {
 var elem;
 if (document.getElementById)
 {
 var elem = document.getElementById(id);
 if(elem !== null && elam.style){
 elem.style.cursor=cursorStyle;
 }
 }
 }
 */

function updateSelectedCourseBox() {
    updateSelectBox(document.getElementById('selectedCourse'), courseList);
}

function updateSelectBox(select, list) {

    if (!select) {
        console.log("error with id");
        return;
    }
    select.options.length = 0;
    for (var i = 0; i < list.length; i++) {
        select.options[select.options.length] = new Option(list[i].code, list[i].code);
    }
}

function setupPrereqPanel() {
    //reset the form
    document.getElementById('addPrereq').reset();

    //populate selected course select box
    updateSelectedCourseBox();
    changeSelectedCourse();
    updatePrereq();

}
function disableElement(element) {
    var c_name = element.className;
    if (c_name && c_name.indexOf('disabled') === -1) {
        element.className = "disabled " + element.className;
    }
}

function enableElement(element) {
    var c_name = element.className;
    if (c_name.indexOf(" ") === -1) {
        if (c_name === 'disabled') {
            element.className = "";
        }
        return;
    }
    else {
        var a = c_name.split(" ");
        c_name = "";
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== 'disabled') {
                c_name += a[i] + " ";
            }
        }
        element.className = c_name;
    }
}

function changeSelectedCourse() {
    var sel = document.getElementById('selectedCourse');
    //if there's no selected course, nothing to do on this page
    if(sel.selectedIndex === -1){ alert("you need to add classes for this to be useful"); return; }
    var selectedCode = sel.options[sel.selectedIndex].text;
    var list = new Array();
    for (var i = 0; i < courseList.length; i++) {
        if (courseList[i].code !== selectedCode) {
            if(getSelectedCourse().prereq.indexOf(courseList[i]) === -1){
                if( courseList[i].prereq.indexOf(getSelectedCourse()) === -1){
                    list.push(courseList[i]);
                }
            }
        }
    }
    updateSelectBox(document.getElementById('selectPrereq'), list);
    updatePrereq();
}
function getCourse(code) {
    for (var i = 0; i < courseList.length; i++) {
        if (code === courseList[i].code) {
            return courseList[i];
        }
    }
    return null;
}

function getSelectedCourse() {
    var sel = document.getElementById('selectedCourse');
    var selectedCode = sel.options[sel.selectedIndex].text;
    return getCourse(selectedCode);
}
function addPrerequisite() {
    var sel = document.getElementById('selectPrereq');
    if (sel.options.length === 0) {
        alert("You're going to need to add more classes");
        return false;
    }
    var selectedCode = sel.options[sel.selectedIndex].text;
    if (!selectedCode || selectedCode === "") {
        alert("Please make sure a course is selected");
        return false;
    }
    

    var selCoursePreList = getSelectedCourse().prereq;
    if(selCoursePreList.indexOf(getCourse(selectedCode)) !== -1){
        alert("Already added that course");
        return false;
    }
    if(getCourse(selectedCode).prereq.indexOf(getSelectedCourse()) !== -1){
        alert("Cant be both a prerequisite of and a prerequisite to");
        return false;
    }
    addPrereqToSelectedCourse(getCourse(selectedCode));
    changeSelectedCourse();
    saveAllPrerequisites();
    return false;

}

function addPrereqToSelectedCourse(course){
    var sel = getSelectedCourse();
    //add to the current selected
    sel.prereq.push(course);
    //ensure transitive closure
    for(var i = 0; i < course.prereq.length; i++){
       if(sel.prereq.indexOf(course.prereq[i]) === -1)
       sel.prereq.push(course.prereq[i]);
    }
}

/*
 function imageElementFromName(name){
 var img = document.create('img');
 
 
 }
 */

function updatePrereq() {
    //delete all elements
    removeAllRowsFromPrereqTable();
    //add all elements from prereq list
    addAllPrereqForSelected();
}

/*

function deleteRowFromPrereqTable(code) {

    var table = document.getElementById('prereqTable');
    var rowCount = table.rows.length;

    for (var i = 0; i < rowCount; i++) {
        var row = table.rows[i];
        var rowCode = row.cells[0].innerHTML;
        if (rowCode === code) {
            table.deleteRow(i);
            rowCount--;
            i--;
        }
    }
}
*/

function addAllPrereqForSelected() {
    var sel = getSelectedCourse();
    for (var i = 0; i < sel.prereq.length; i++) {
        displayPrereq(sel.prereq[i]);
    }
}

function removeAllRowsFromPrereqTable() {
    var table = document.getElementById('prereqTable');

    while (table.rows.length > 1) {
        table.deleteRow(table.rows.length - 1);
    }
}

function displayPrereq(course) {
    var table = document.getElementById('prereqTable');
    var newRow = table.insertRow(table.rows.length);

    var col1 = newRow.insertCell(0);
    col1.innerHTML = course.code;

    var col2 = newRow.insertCell(1);
    if (course.isCompleted) {
        col2.innerHTML = "✔";
    }
    else {
        col2.innerHTML = "✘";
    }

    var col3 = newRow.insertCell(2);
    if (course.inMajor) {
        col3.innerHTML = "✔";
    }
    else {
        col3.innerHTML = "✘";
    }

    var col4 = newRow.insertCell(3);
    if (course.inMinor) {
        col4.innerHTML = "✔";
    }
    else {
        col4.innerHTML = "✘";
    }
    
    
    newRow.addEventListener('click', clickList, false);
}

function removeHighlightedPrerequisites(){
   
   //change the model: remove the highlighted prerequisite and any classes that share that prerequisite
   var table = document.getElementById('prereqTable');
    for(var i = 0; i < table.rows.length; i++){
        if(table.rows[i].className.indexOf('highlighted') !== -1){
            removeFromSelectedPrerequisites(getCourse(table.rows[i].cells[0].innerHTML));
        }
    }
   
   //update the view
    updatePrereq();
    //more view updating
    changeSelectedCourse();
    //save any changes
    saveAllPrerequisites();
    
}

//remove the course parameter from selected course prerequisite
// and ensure transitive property remains
function removeFromSelectedPrerequisites(course){
    var list = getSelectedCourse().prereq;
    var index = list.indexOf(course);
    if(index !== -1){
        list.splice(index,1);
    }
    else{
        console.log("couldn't find the course " + course);
    }
    
    for(var i = 0; i < list.length; i++){
        if(list[i].prereq.indexOf(course) !== -1){
            removeFromSelectedPrerequisites(list[i]);
        }
    }
}

function continueToGraph(){
    var elements = document.getElementsByClassName('editPrerequisits');
    for (var i = 0; i < elements.length; i++) {
        disableElement(elements[i]);
    }
    enableElement(document.getElementById('hasseGraph'));
    
    drawGraph();
}

function savePrerequisites(course){
    var value = "";
    for(var i = 0; i < course.prereq.length - 1; i++){
        value += course.prereq[i].code + ",";
    }
    if(course.prereq.length >= 1){
        value += course.prereq[course.prereq.length -1].code;
    }
    saveCookie("adj"+course.code, value, 60);
}

function saveAllPrerequisites(){
    for(index in courseList){
        savePrerequisites(courseList[index]);
    }
}

function loadAllPrerequisitsFromCookie(){
    for(index in courseList){
        loadPrerequisitesFromCookie(courseList[index]);
    }
}

function loadPrerequisitesFromCookie(course){
    if(course === null || course.code === null) { return; }
    var val = getCookieValue("adj"+course.code);
    if(val === null || val === "") { return; }
    var list = val.split(",");
    for(var i = 0; i < list.length; i++){
        var c = getCourse(list[i]);
        if(c !== null){
            course.prereq.push(c);
        }
    }
}

function drawGraph(){
    //get the fiv for sigma.js to draw a canvas on
    var sigRoot = document.getElementById('hasseGraph');
    //make sure it's empty
    while(sigRoot.hasChildNodes()){
        sigRoot.removeChild(sigRoot.lastChild);
    }
    //make a new grao instance
    var sigInst = sigma.init(sigRoot).drawingProperties({
        defaultLabelColor: '#000',
        font: 'Arial',
        edgeColor: 'source',
        defaultEdgeType: 'straight',
        
      }).graphProperties({
        minNodeSize: 1,
        maxNodeSize: 7,
        minEdgeSize: 2,
        maxEdgeSize: 5
      });
     
    var map = mapOfNodeProperties();
    //index is a uniqe course code, and map references a properties object
    for(index in map){
        sigInst.addNode(index, {
            label : index,
            color : map[index].color,
            x : map[index].x,
            y : map[index].y
        });
    }
    //add all the edges
    /*
    for(var i = 0 ; i < courseList.length; i++){
        for(var j = 0; j < courseList[i].prereq.length; j++){
            var s = courseList[i].prereq[j].code + ">" + courseList[i].code;
            try {
            sigInst.addEdge(s, courseList[i].prereq[j].code, courseList[i].code);
           }catch (err){
               if(err.toString() !== 'Edge "'+s+'" already exists.'){
                   throw(err);
               }
           }
           
        }
    }
    */
   
   for(i in courseList){
       var p = courseList[i].prereq;
       //console.log("start with course " + courseList[i].code);
       for(j in p){
           //assume valid prerequisite
           var validEdge = true;
           //check the res of the prerequisits
           for(l in p){
               // if the node exists as a prerequisite in others don't add it
               if(p[l].prereq.indexOf(p[j]) !== -1){
                   validEdge = false;
               }
           }
           //add the edge if it's valid
           if(validEdge){
               var s = p[j].code + ">" + courseList[i].code;
               //console.log('adding edge ' + s);
               sigInst.addEdge(s, p[j].code, courseList[i].code);
           }
       }
   }
    //actually draw on screen
    sigInst.draw();
    
    
}

function mapOfNodeProperties(){
    // copy of course list since I'll be adding and removing elements
    var toAdd = new Array();
    for(var i = 0; i < courseList.length; i++){
        toAdd.push(courseList[i]);
    }
    var added = new Array(); // will contain courses already added
    
    //this will hold a list of course codes as keys and a simple vector as value
    var ret = {};
    var min = getMinimalElements(toAdd, added);
    var numLevels = 0;
    while(toAdd.length > 0){
        for(var i = 0; i < min.length; i++){
            ret[min[i].code] = {
                x : ((2*i+1)/parseFloat(min.length) - 1)*0.8,
                y : numLevels
                };
            ret[min[i].code].color = colorForCourse(min[i]);
            var index = toAdd.indexOf(min[i]);
            toAdd.splice(index,1);
            added.push(min[i]);
        }
        min = getMinimalElements(toAdd, added);
        numLevels++;
    }
    
    //go through course list and set y values base on number of levels
    for(index in ret){
        ret[index].y = (numLevels-ret[index].y)/parseFloat(numLevels) - 0.5;
    }
    
    return ret;
    
}
//get an array of all minimal course objects
function getMinimalElements(toAdd, added){
    var minimal = new Array();
        
    for(var i = 0; i < toAdd.length; i++){
        if(toAdd[i].prereq.length === 0){
            minimal.push(toAdd[i]);
        }
        else{
            //is minimal if all prerequisites have been added
            var isMinimal = true;
            var c = toAdd[i];
            for(var j = 0; j < c.prereq.length; j++){
                if(added.indexOf(c.prereq[j]) === -1){
                    //then we have problems
                    isMinimal = false;
                }
            }
            if(isMinimal){
                minimal.push(toAdd[i]);
            }
        }
    }
    return minimal;
}

function transitionTo(key){
    //start blank
    var elementIds = ["left", "right", "editPrereq", "hasseGraph", 'partialOrders'];
    for(i in elementIds){
        disableElement(document.getElementById(elementIds[i]));
    }
    
    
    //enable proper elements based on div item clicked. Check html file.
    switch (key){
        case 'class':
            enableElement(document.getElementById('left'));
            enableElement(document.getElementById('right'));
            break;
        case 'prereq' :
            enableElement(document.getElementById('editPrereq'));
            setupPrereqPanel();
            break;
        case 'graph' :
            enableElement(document.getElementById('hasseGraph'));
            drawGraph();
            break;
        case 'order' :
            enableElement(document.getElementById('partialOrders'));
            setUpPartialOrders();
            break;
        default :
            console.log("spelling error");
    }
}

function colorForCourse(c){
    var str = "";
    if(c.isCompleted){
       str = "#67af35";
    }
    else if(c.isElective){
        str = "#3a98c2";
    }
    else{
        str = "#6a2b2b";
    }
    return str;
}

function setUpPartialOrders(){
    //update the semester lists
    updateSemesterLists(0);
    //updateClassSearch
    resetClassSeach();
    //update the saved orderings panel
    updateSavedOrderings();
    
}

function resetClassSeach(){
    var list = document.getElementById('classSearchList');
    $(list).empty();
    for(var i = courseList.length - 1; i >= 0; i--){
        //create a list element with code as text node
        if(!currentOrder().contains(courseList[i])){
            var element = document.createElement('li');
            element.innerHTML = courseList[i].code;
            //make it dragable, requires jquerry ui
            $(element).draggable();
            //add it to the current list
            list.insertBefore(element, list.firstChild);
        }
    }
}

function currentOrder(){
    
    var order = new Ordering();
    order.loadFromString(getCookieValue('current_order'));
    return order;
    
}

function clearCurrentOrder(){
    if(confirm("Are you sure you want to erase everything?")){
        deleteCookie('current_order');
    }
    setUpPartialOrders();
    
}

function maxClassesPerSemester(){
    return 5;
}

function autoFillCurrentOrder(){
    //reset the current order for now...
    deleteCookie('current_order');
    //change the model
    currentOrder().orderClasses(0);
    //update the view
    setUpPartialOrders();
}

//update semester Lists
function updateSemesterLists(startIndex){
    //get lists elements
    var lists = document.getElementsByClassName('semesterList');
    //remove <li>s
    for(var i = 0; i < lists.length; i++){
       $(lists[i]).empty();
    }
    //for each list element
    var order = currentOrder();
    
    for(var i = 0; i < lists.length; i++){
        //change the labels for semester numbers
        var semester = i + startIndex;
        //make each list droppable with class
        $(lists[i]).droppable({
            drop: function(ev, ui){
                //add the course to the current order
                console.log("sem = " + semester + " start = " + startIndex + " code = " + $(ui.draggable).text());
                var listNum = $(this).attr("id");
                listNum = listNum.replace("semester", "");
                listNum = parseInt(listNum);
                console.log(listNum);
                order.addToSemester(listNum, $(ui.draggable).text());
                //remove the draggable li
                $(ui.draggable).detach().remove();
                //update the semesters panel
                updateSemesterLists(startIndex);
            }
        });
        //console.log(order.semesters.length + " : " + order) ;
        //add all the classes for the i + start index
        var numClass = order.getNumClasses(semester);
        //should be max classes but default ot 5 for now
        for(var j = 0; j < 5 || j < numClass; j++){
            if(j < numClass) {
                //
                var code = order.semesters[semester].codes[j];
                //create a list element with code as text node
                var element = document.createElement('li');
                element.innerHTML = code;
                //add it to the current list
                lists[i].insertBefore(element, lists[i].firstChild);
            }
            else{
                lists[i].insertBefore(document.createElement('li'), lists[i].firstChild);
            }
        }
    }
}

//ordering object
function Ordering(){
    this.semesters = new Array();
    this.saveDate = new Date();
}

Ordering.prototype.loadFromString = function(str){
    if(str === null || str === ""){ return; }
    this.semesters = new Array();
    var tokens = str.split(",");
    var curSemester = 0; 
    for(var i = 0; i < tokens.length; i++){
        //check for new semester
        if(tokens[i] === "new_semester"){
            curSemester++;
        }
        else{ // else add the code to the current semester
            //keep this else for when the last one is new_semester token
            if(tokens[i] !== ""){
                this.addToSemester(curSemester, tokens[i]);
            }
        }
    }
};
Ordering.prototype.getNumClasses = function(index){
    //lazy instantiation of semesters up to semester index
    if(this.semesters[index] === undefined || this.semesters[index] === null){
        for(var i = 0; i <= index; i++){
            if(this.semesters[i] === undefined || this.semesters[i] === null){
                //console.log("here " + i);
                this.semesters[i] = new Semester();
            }
        }
    }
    return this.semesters[index].codes.length;
};

Ordering.prototype.orderClasses = function(){
    var toAdd = new Array();
    var added = new Array();
    for(var i = 0; i < courseList.length; i++){
            toAdd.push(courseList[i]);
    }
    
    var semCount = 0;
    while(toAdd.length > 0 && semCount <15){
        var minElements = getMinimalElements(toAdd, added);
        if(minElements > maxClassesPerSemester()){
            //need to choose which classes to add
            console.log("sorry can't do this yet");
        }
        for(var i = 0; i < minElements.length; i++){
            this.addToSemester(semCount, minElements[i].code);
            toAdd.splice(toAdd.indexOf(minElements[i]),1);
            added.push(minElements[i]);
        }
        semCount++;
    }
    
};

Ordering.prototype.contains = function(course){
    for(var i = 0; i < this.semesters.length; i++){
        if(this.semesters[i].codes.indexOf(course.code) !== -1){
            return true;
        }
    }
    return false;
};
//semester number will alway be -1
Ordering.prototype.addToSemester = function(semester_num, code){
    //keep semesters created if needed
    //if the current semester is null
    if(this === null){
        console.log("is this even possible");
    }
    if(this.semesters === null ){
        this.semesters = new Array();
    }
    if(this.semesters[semester_num] === null || this.semesters[semester_num] === undefined){
        //better check all of them up to the number given
        for(var i = 0; i <= semester_num; i++){
            if(this.semesters[i] === null || this.semesters[i] === undefined){
                ///set it to a new semester object
                this.semesters[i] = new Semester();
            }
        }
    }
    //now add the course as intended
    //console.log(this.semesters + " : " + this.semesters[semester_num]);
    this.semesters[semester_num].addCode(code);
    saveCookie('current_order', this.toString(), 60);
};

Ordering.prototype.toString = function(){
    var retString = "";
    for(var i = 0; i < this.semesters.length; i++){
        retString += this.semesters[i].toString();
        if(i < this.semesters.length -1){
            retString += 'new_semester,';
        }
    }
    return retString;
};

//end ordering object

//semester object
function Semester(){
    this.codes = new Array();
    return this;
}

Semester.prototype.addCode = function(code){
    this.codes.push(code);
};

Semester.prototype.toString = function(){
    var retString = "";
    for(var i = 0; i < this.codes.length; i++){
        retString += this.codes[i];
        if(this.codes[i] !== null && retString !== "" && this.codes[i] !== undefined){
            retString += ",";
        }
    }
    return retString;
};

//end semester object