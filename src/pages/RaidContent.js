import React, { useState, useEffect } from 'react';
import { 
    getRaidfloors, 
    createRaidfloor, 
    updateRaidfloor, 
    deleteRaidfloor 
} from '../services/raidfloorService';

const RaidContent = () => {
    const [contentPanels, setContentPanels] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        order: 1
    });
    const [editingPanel, setEditingPanel] = useState(null);

    // Fetch content panels from API
    const fetchContentPanels = async () => {
        const data = await getRaidfloors();
        const sortedPanels = data.sort((a, b) => a.order - b.order);
        setContentPanels(sortedPanels);
    };

    useEffect(() => {
        fetchContentPanels();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Create new raid floor
    const handleCreate = async (e) => {
        e.preventDefault();
        const data = await createRaidfloor(formData);
        setContentPanels([...contentPanels, data]);
        setFormData({
            name: '',
            description: '',
            order: 1
        });
    };

    // Edit an existing raid floor
    const handleEdit = (panel) => {
        setEditingPanel(panel);
        setFormData({
            name: panel.name,
            description: panel.description,
            order: panel.order
        });
    };

    // Update the raid floor
    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = await updateRaidfloor(editingPanel.id, formData);
        const updatedPanels = contentPanels.map(panel =>
            panel.id === editingPanel.id ? data : panel
        );
        setContentPanels(updatedPanels);
        setEditingPanel(null);
        setFormData({
            name: '',
            description: '',
            order: 1
        });
    };

    // Delete a raid floor
    const handleDelete = async (panel) => {
        await deleteRaidfloor(panel.id);
        setContentPanels(contentPanels.filter(p => p.id !== panel.id));
    };

    return (
        <div>
            <h1>Raid Content Management</h1>
            <form onSubmit={editingPanel ? handleUpdate : handleCreate}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                />
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />
                <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    placeholder="Order"
                    required
                />
                <button type="submit">
                    {editingPanel ? "Update" : "Create"}
                </button>
                {editingPanel && (
                    <button onClick={() => setEditingPanel(null)}>
                        Cancel
                    </button>
                )}
            </form>

            <ul>
                {contentPanels.map(panel => (
                    <li key={panel.id}>
                        <h3>{panel.name}</h3>
                        <p>{panel.description}</p>
                        <p>Order: {panel.order}</p>
                        <button onClick={() => handleEdit(panel)}>Edit</button>
                        <button onClick={() => handleDelete(panel)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RaidContent;