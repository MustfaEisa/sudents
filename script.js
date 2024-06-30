const token = 'YOUR_BOT_TOKEN';
const students = new Map();

function fetchStudents() {
    fetch(`https://api.telegram.org/bot${token}/getUpdates`)
        .then(response => response.json())
        .then(data => {
            const honorWall = document.getElementById('honorWall');
            honorWall.innerHTML = ''; // مسح الحائط قبل إعادة التعبئة

            const messages = data.result.filter(msg => 
                msg.message.text.startsWith('/addstudent') || 
                msg.message.text.startsWith('/removestudent') || 
                msg.message.text.startsWith('/editstudent')
            );

            messages.forEach(msg => {
                const parts = msg.message.text.split(' ');
                const command = parts[0];
                const studentName = parts.slice(1).join(' ');

                if (command === '/addstudent' && studentName) {
                    addStudentToWall(studentName);
                } else if (command === '/removestudent' && studentName) {
                    removeStudentFromWall(studentName);
                } else if (command === '/editstudent' && studentName) {
                    const [oldName, newName] = studentName.split(',').map(s => s.trim());
                    editStudentOnWall(oldName, newName);
                }
            });

            displayStudents();
        })
        .catch(error => console.error('Error fetching data:', error));
}

function addStudentToWall(studentName) {
    if (!students.has(studentName)) {
        const posX = Math.random() * 80;
        const posY = Math.random() * 80;
        const rotation = Math.random() * 20 - 10;
        students.set(studentName, { x: posX, y: posY, rotation });
    }
}

function removeStudentFromWall(studentName) {
    students.delete(studentName);
}

function editStudentOnWall(oldName, newName) {
    if (students.has(oldName)) {
        const position = students.get(oldName);
        students.delete(oldName);
        students.set(newName, position);
    }
}

function displayStudents() {
    const honorWall = document.getElementById('honorWall');
    students.forEach((position, studentName) => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student';
        studentDiv.textContent = studentName;
        studentDiv.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 85%)`;
        studentDiv.style.left = `${position.x}%`;
        studentDiv.style.top = `${position.y}%`;
        studentDiv.style.transform = `rotate(${position.rotation}deg)`;
        honorWall.appendChild(studentDiv);
    });
}

// تحديث البيانات كل ثانيتين
setInterval(fetchStudents, 2000);
