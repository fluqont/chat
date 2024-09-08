import Form from "../components/Form";
import InputField from "../components/InputField";

const NewGroup = () => {
  return (
    <section className="centered-section">
      <h1>New group</h1>
      <Form isLoading={false}>
        <InputField label="name" required minLength={1} maxLength={30} />
      </Form>
    </section>
  );
};

export default NewGroup;
