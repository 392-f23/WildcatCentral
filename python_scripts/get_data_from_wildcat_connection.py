import requests
import time
import json
import os
from datetime import datetime

API_URL = "https://northwestern.campuslabs.com/engage/api/discovery/event/search"
HEADERS = {
    'User-Agent': 'Mozilla/5.0',
}
PARAMS = {
    "orderByField": "endsOn",
    "orderByDirection": "ascending",
    "status": "Approved",
    "take": 100,
    "query": "",
}

def get_current_time():
    return datetime.now().isoformat()

def fetch_data():
    results = []
    skip_count = 0
    while True:
        PARAMS['endsAfter'] = get_current_time()
        PARAMS['skip'] = skip_count
        
        response = requests.get(API_URL, headers=HEADERS, params=PARAMS)
        data = response.json()
        
        results.extend(data['value'])
        
        if "@odata.count" in data and data["@odata.count"] > skip_count + 100:
            skip_count += 100
        else:
            break
            
    return results

def save_to_json_file(data, filename="events.json"):
    # make directory if not exists
    if not os.path.exists("../src/data/"):
        os.makedirs("../src/data/")
    # save to ../src/data/
    filename = "../src/data/" + filename
    # Load existing data if exists
    existing_data = []
    try:
        with open(filename, 'r') as f:
            existing_data = json.load(f)['value']
    except (FileNotFoundError, json.JSONDecodeError):
        pass
    
    # Use the 'id' field to check for unique items
    added_count = 0
    existing_ids = [entry['id'] for entry in existing_data]
    for entry in data:
        if entry['id'] not in existing_ids:
            # add a field to indicate when the entry was added
            entry['addedOn'] = time.strftime("%Y-%m-%dT%H:%M:%S+00:00", time.gmtime())
            # add a field to indicate that this entry was added by this script
            entry['fromWildcatConnection'] = True
            if entry['imagePath'] is None:
                entry['image'] = "https://static.campuslabsengage.com/discovery/images/events/social.jpg"
            else:
                # add image using imagePath
                entry['image'] = "https://se-images.campuslabs.com/clink/images/" + entry['imagePath']
            if entry['organizationProfilePicture'] is not None:
                # add organizationProfilePicture using organizationProfilePicture
                entry['organizationProfilePicture'] = "https://se-images.campuslabs.com/clink/images/" + entry['organizationProfilePicture']
            # replace @search.score with searchScore
            entry['searchScore'] = entry.pop('@search.score')
            # make sure categoryNames exists, if not add an empty list
            if 'categoryNames' not in entry:
                entry['categoryNames'] = []
            
            existing_data.append(entry)
            added_count += 1
    
    # Save back to file
    with open(filename, 'w') as f:
        json.dump({"value": existing_data}, f, indent=4)
    
    return added_count

def main():
    print("=====================================")
    print(f"Starting script to fetch data hourly from Wildcat Connection at {get_current_time()}")
    print("=====================================")
    while True:
        print(f"[+] Fetching data at {get_current_time()}")
        data = fetch_data()
        added_count = save_to_json_file(data)
        print(f"[v] {added_count} new entries added")
        print(f"[*] Total entries: {len(data)}")
        print(f"[*] Sleeping for an hour...")
        time.sleep(3600)  # Wait for an hour

if __name__ == "__main__":
    main()
