import os
import glob
import pandas as pd

keyframes_dir = './AIC_Keyframes'
all_keyframe_paths = {'video_name': [], 'frame_id': [], 'keyframe_path': []}

for data_part in sorted(os.listdir(keyframes_dir)):
    data_part_path = f'{keyframes_dir}/{data_part}'
    video_dirs = sorted(os.listdir(data_part_path))
    
    for video_dir in video_dirs:
        keyframe_paths = sorted(glob.glob(f'{data_part_path}/{video_dir}/{video_dir}_keyframes/*.jpg'))
        for i in range(len(keyframe_paths)):
            keyframe_paths[i] = keyframe_paths[i].replace('\\','/')
        all_keyframe_paths['keyframe_path'] += keyframe_paths
        all_keyframe_paths['video_name'] += [video_dir] * len(keyframe_paths)
        all_keyframe_paths['frame_id'] += [int((path.split('/')[-1]).split('_')[1][:-4]) for path in keyframe_paths]

# Convert to pandas DataFrame
df = pd.DataFrame(all_keyframe_paths)

# Export to CSV
df.to_csv('keyframe_paths.csv', index=False)

print("CSV file 'keyframe_paths.csv' created successfully.")
