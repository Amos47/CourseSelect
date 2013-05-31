<!--
To change this template, choose Tools | Templates
and open the template in the editor.
-->
<!DOCTYPE html>
<html>
    <head>
        <title>Course Selection</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel ="stylesheet" type="text/css" href="courseSelectionStyle.css">
        <script src ="jquery-1.9.1.min.js" type="text/javascript"></script>
        <script src ="sigma.min.js" type="text/javascript"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
        <script src ="courseSelection.js" type="text/javascript"></script>
    </head>
    <body>
        <!-- beginning of header -->
        <div id ='header'>
            <h1>Course Selection</h1>
            <hr size ="3px" color="#6a2b2b" id='bannerUnderline'>
        </div>
        <!-- end of header -->
        <div id="navMenu">
            <div class ="menuButton" onclick="transitionTo('class');">Edit Course List</div>
            <div class ="menuButton" onclick="transitionTo('prereq');">Edit Prerequisites</div>
            <div class ="menuButton" onclick="transitionTo('graph');">View Visualization</div>
            <div class ="menuButton" onclick="transitionTo('order');">Possible Orderings</div>
        </div>
        
        <div id="left" class="input">
            <h3> Add a Course </h3>
            <form id="addClass" name="addClass" onsubmit="return addCourse();">
                <p>Course Code: <input type="text" name="courseCode"></p>
                <h4>Where does it fit in the program? </h4>
                <ul>
                    <li><input type="radio" name="courseType" value="Major" checked="checked">Part of Major</li>
                    <li><input type="radio" name="courseType" value="Minor">Part of Minor</li>
                    <li><input type="radio" name="courseType" value="Elective">Elective</li>
                </ul>
                <h4>Have you already completed this course (passing grade)?</h4>
                <ul>
                    <li><input type="radio" name="completed" value="Yes">Yes</li>
                    <li><input type="radio" name="completed" value="No" checked="checked">No</li>
                    <li><input type="radio" name="completed" value="InProgress">In Progress</li>
                </ul>
                <input type="submit" value="Add Course" name="addCourseButton" />
            </form>
        </div>
        
        <div id ="right" class ="input">
            <h3>Course List</h3>
            <ul id ="classList">
            </ul>
            <div id='buttonWrapper'>
                <div class="button" onclick="removeSelectedElements();">Remove</div>
            </div>
        </div>
        <div id ="editPrereq" class ='input editPrerequisits disabled'>
            <div id ='editPrerequisitsLeft' class='input'>
                <h3>Edit Prerequisites</h3>
                <form id='addPrereq' name='addPrereq' onsubmit="return addPrerequisite();">
                    <p> Selected Course: <br>
                        <select name="selectedCourse" id ='selectedCourse' onchange="changeSelectedCourse();">
                        </select></p>
                    
                    <p> Add Prerequisite:<br>
                        <select name ='selectPrereq' id ='selectPrereq'>
                            
                        </select>
                    </p>
                    <input type="submit" value="Add Prerequisite" name='submitPrereq' />
                </form>
            </div>
            <div id ='editPrerequisitsRight' class='input'>
                <h3>Current Prerequisites</h3>
                <table id ='prereqTable'>
                    <tr>
                        <th>Course</th>
                        <th>Complete</th>
                        <th>Major</th>
                        <th>Minor</th>
                    </tr>
                </table>
                <br>
                <div id='removePrereqButton' class="button" onClick='removeHighlightedPrerequisites();'>Remove</div>
            </div>
            <div id='editPrerequisitsBottom'>
            </div>
        </div>
            <div id='hasseGraph' class ='input disabled'>
            </div>
        <div id="partialOrders" class='input disabled'>
            <div id='partialOrdersHeader'>
                <h2>Class Orderings</h2>
            </div>
            <div id ='partialOrdersInfo'>
                <div>
                    Max Classes per semester: 
                    <select name="maxClasses" id ='maxClasses'>
                    </select>
                    <div class="button" onclick='autoFillCurrentOrder();'>Auto-fill</div>
                </div>
            </div>
            <div id ='listWrapper'>
                <div id='list1Wrap' class ='lWrap'>
                    <h3 id='semesterHead1'>Semester 1</h3>
                    <ul id ='semester0' class="semesterList dragList"></ul>
                </div>
                <div id='list2Wrap' class ='lWrap'>
                    <h3 id='semesterHead2'>Semester 2</h3>
                    <ul id ='semester1' class="semesterList dragList"></ul>
                </div>
                <div id='list3Wrap' class ='lWrap'>
                    <h3 id='semesterHead3'>Semester 3</h3>
                    <ul id ='semester2' class="semesterList dragList"></ul>
                </div>
                <div id='list4Wrap' class ='lWrap'>
                    <h3 id='semesterHead4'>Semester 4</h3>
                    <ul id ='semester3' class="semesterList dragList"></ul>
                </div>
                <div id='backButton' class="button"> &lt; </div>
                <div id='forwardButton' class ='button'> &gt; </div>
                <div id='bottomButtonWrap'>
                    <div id='clearOrdering' class="button" onClick ='clearCurrentOrder();'>Clear</div>
                    <div id='printVersion' class ='button'>Printer Friendly</div>
                    <div id="saveOrder" class = 'button'>Save Changes</div>
                </div> 
            </div>
            <div class ='lWrap' id='classSearch'>
                <h3>Class Search</h3>
                <p>Search Bar here</p>
                <ul id='classSearchList' class="dragList"></ul>
            </div>
        </div>
    </body>
</html>
