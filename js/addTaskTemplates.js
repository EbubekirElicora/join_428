function subTaskProgressTemplate(id, subtask) {
    return `
                <div class="subTaskEdit">
                    <div class="leftContainerSubTask">
                        <input type="text" id="editInput${id}" value="${subtask}" class="subTaskEditInput">
                    </div>
                    <div class="rightContainerSubTask">
                        <div>
                            <img class="subTaskDeleteButtonInput" onclick="deleteSubTask(${id})" src="../assets/icons/delete.png" alt="Delete">
                        </div>
                        <div class="partingLine"></div>
                        <div>
                            <img class="subTaskSaveButton" onclick="saveSubTask(${id})" src="../assets/icons/check.png" alt="Save">
                        </div>
                    </div>
                </div>
            `;
}

function subTaskCreatedTemplate(id, subtask) {
    return `
        <div class="subTask" onclick="editSubTask(${id})">
            <div class="leftContainerSubTask">
                <ul class="subTaskListContainer">
                    <li class="listSubTask"><span>${subtask}</span></li>
                </ul>
            </div>
            <div class="rightContainerSubTask">
                <div class="subTaskButtons">
                    <img class="subTaskEditButton" onclick="editSubTask(${id})" src="../assets/icons/edit.png" alt="Edit">
                    <div class="partingLine"></div>
                    <img class="subTaskDeleteButton" onclick="deleteSubTask(${id})" src="../assets/icons/delete.png" alt="Delete">
                </div>
            </div>
        </div>
    `;
}