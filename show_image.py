import cv2

# Load image using the path stored in database
img_path = "faces/annu photo.jpg"  # relative path from project folder
img = cv2.imread(img_path)

if img is not None:
    cv2.imshow("Face Image", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
else:
    print("❌ Image not found")