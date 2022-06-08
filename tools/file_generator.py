import shutil


def generate_files(src, dst, name, extension):
    for i in range(0, 5000):
        print("Creating file number " + str(i))
        shutil.copy(src, dst + "\\" + name + "_" + str(i) + extension)


if __name__ == '__main__':
    source = r'Add source path here'
    destination = r'Add destination path here'
    file_name = "name"
    file_extension = ".PNG"
    generate_files(source, destination, file_name, file_extension)
