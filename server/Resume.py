import tempfile
from resume_extractor import ResumeExtractor

class Resume:
    def __init__(self, data):
        self.data = data

    def get_filtered_data(self):
        filter_labels = {
            'degree',
            'designation',
            'email',
            'experience',
            'name',
            'no_of_pages',
            'skills',
            'total_experience'
        }

        filtered_data = {}
        for label in filter_labels:
            if label in self.data and self.data[label]:
                filtered_data[label] = self.data[label]
        return filtered_data

    @staticmethod
    def process_uploaded_file(file):
        try:
            pdf_bytes = file.read()
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
                temp_pdf.write(pdf_bytes)
                temp_pdf_path = temp_pdf.name
            data = ResumeExtractor(temp_pdf_path).get_extracted_data()
            return Resume(data)
        except Exception as e:
            print(f"Error processing resume: {str(e)}")
            return None
