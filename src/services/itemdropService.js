import axios from "axios";
import { getUser } from "../services/userService"; 
import { getRaiditem } from '../services/raiditemService';
import { getRaidfloor } from '../services/raidfloorService';
const API_URL = process.env.REACT_APP_ACAC_API_URL + "/itemdrops";
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1364057014803763250/RCYVi6uQalwwUILBC9ECtEhseSRKGDej-_36Jo8AM1pSCv2VM6KHTgLB5WwFMlc16yba";

async function postToDiscord(message) {

  try {

    const varuser = await getUser(message.userid);
    const varitem = await getRaiditem(message.itemid);
    const varfloor = await getRaidfloor(varitem.floorid);

    //console.log("Item:", varitem);
   
    if (typeof axios.post !== "function") {
      console.error("Axios is corrupted or not a function:", axios);
      return
    }

    if (!DISCORD_WEBHOOK_URL) {
      console.error("Discord Webhook URL is not defined");
      return;
    }

    await axios.post(DISCORD_WEBHOOK_URL, {
      content: ">>> Duty: " + varfloor.name + "\r\nRaider: " + varuser.name + "\r\nItem: " + varitem.name + "\r\nDate: " + new Date().toLocaleDateString(),
    });
    //console.log("Message posted to Discord");
  } catch (error) {
    console.error("Failed to post to Discord:", error.response?.data || error.message);
  }
}


// Fetch all item drops
export const getItemDrops = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error fetching item drops:", error);
    return [];
  }
};

// Fetch a single item drop by ID
export const getItemDrop = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching item drop:", error);
    return null;
  }
};

// Create a new item drop
export const createItemdrop = async (itemData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });
    try {
      await postToDiscord(itemData);
    } catch (discorderror) { console.error("Error posting to discord:", discorderror); }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating item drop:", error);
    return null;
  }
};

// Update an existing item drop
export const updateItemdrop = async (id, itemData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating item drop:", error);
    return null;
  }
};

// Delete a item drop
export const deleteItemdrop = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error deleting item drop:", error);
    return false;
  }
};
