import "./home_tag_edit.css"
import { TaskContext } from "../home.js";
import addTag from '../crud/add_tag.js'
import deleteTag from "../crud/delete_tag.js";
import updateTag from "../crud/update_tag.js";

import { useState, useContext } from "react";

import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import { IoTrashBinSharp } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";

const TagEdit = (props) => {
    const { tagEdit, setTagEdit, tagRepo, setTagRepo, setCheckedTags } = props;
    const [, , , , loading, setLoading, , defColor] = useContext(TaskContext);
    const [tName, setTName] = useState(tagEdit.tag.name);
    const [tColor, setTColor] = useState(tagEdit.tag.color);
    const [error, setError] = useState(undefined);

    const handleAddUpdate = () => {
        if (tName === "") {
            setError("Invalid name!");
            return
        }
        else if ((tName === tagEdit.tag.name) && (tColor === tagEdit.tag.color)) {
            setTagEdit(undefined);
            return
        } else if ((tagEdit.type === "add") && tagRepo.map(tag => tag.name).includes(tName)) {
            setError("This name is already exist!");
            return
        }

        var data = {
            name: tName,
            color: tColor
        };

        console.log(data);

        if(tagEdit.type === "add") addTag(data, setTagRepo, loading, setLoading, setCheckedTags);
        else updateTag(tagEdit.tag.id, data, setTagRepo, loading, setLoading);
        setTagEdit(undefined);
    }

    return (
        <div className="tag-edit-container"
            onMouseDown={() => setTagEdit(undefined)}
            style={{ background: "radial-gradient(#000000BF, " + tColor + "BF)" }}>
            <div className="tag-edit" onMouseDown={e => e.stopPropagation()}>
                <div className="tag-edit__meta">
                    <div className="tag-edit__start">
                        <div className="tag-edit__start-icon"><AiFillEdit /></div>
                        <p className="tag-edit__name-container">
                            <input className="tag-edit__name"
                                type="text"
                                placeholder="Tag Name"
                                defaultValue={tName}
                                onChange={e => setTName(e.target.value)} />
                        </p>
                    </div>
                    <div className="tag-edit__color">
                        <input
                            className="tag-edit__color-input"
                            type="color"
                            value={tColor}
                            onChange={(e) => setTColor(e.target.value)} />
                        <div className="tag-edit__color-reset"
                            onClick={() => setTColor(defColor.current["tag"])}><GrPowerReset />
                        </div>
                    </div>
                </div>
                <div className="tag-edit__option">
                    <div onClick={() => setTagEdit(undefined)}><FaXmark /></div>
                    <div className="task-edit__save"
                        onClick={() => handleAddUpdate()}><FaCheck /></div>
                    {
                        tagEdit.type === "update" ?
                            <div onClick={() => {
                                deleteTag(tagEdit.tag.id, setTagRepo, loading, setLoading);
                                setCheckedTags(data => data.filter(tagId => tagId !== tagEdit.tag.id));
                                setTagEdit(undefined);
                            }}><IoTrashBinSharp /></div>
                            : null
                    }
                </div>
            </div>
            <div className='tag-edit-error'
                style={{
                    visibility: error ? "visible" : "hidden"
                }}>
                <div className='tag-edit-warning-icon'><IoIosWarning /></div>
                <span><b>{error}</b></span>
            </div>
        </div>
    )
}

export default TagEdit;