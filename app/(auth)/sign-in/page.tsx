import SignInForm from '@/components/form/SignInForm';

const page = () => {
    return (
        <div className=' p-6 rounded-md 
            bg-neutral-50/10
        w-full max-w-sm'>
            <SignInForm />
        </div>
    );
};

export default page;