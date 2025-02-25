function subTaskProgressTemplate(index, subtask) {
    return `
                <div class="subTaskEdit">
                    <div class="leftContainerSubTask">
                        <input type="text" id="editInput${index}" value="${subtask}" class="subTaskEditInput">
                    </div>
                    <div class="rightContainerSubTask">
                        <div>
                            <img class="subTaskDeleteButtonInput" onclick="deleteSubTask(${index})" src="../assets/icons/delete.png" alt="Delete">
                        </div>
                        <div class="partingLine"></div>
                        <div>
                            <img class="subTaskSaveButton" onclick="saveSubTask(${index})" src="../assets/icons/check.png" alt="Save">
                        </div>
                    </div>
                </div>
            `;
}

function subTaskCreatedTemplate(index, subtask) {
    return `
        <div class="subTask" onclick="editSubTask(${index})">
            <div class="leftContainerSubTask">
                <ul class="subTaskListContainer">
                    <li class="listSubTask"><span>${subtask}</span></li>
                </ul>
            </div>
            <div class="rightContainerSubTask">
                <div class="subTaskButtons">
                    <img class="subTaskEditButton" onclick="editSubTask(${index})" src="../assets/icons/edit.png" alt="Edit">
                    <div class="partingLine"></div>
                    <img class="subTaskDeleteButton" onclick="deleteSubTask(${index})" src="../assets/icons/delete.png" alt="Delete">
                </div>
            </div>
        </div>
    `;
}