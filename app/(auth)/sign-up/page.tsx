import SignUpForm from '@/components/form/SignUpForm';

const page = () => {
    return (
        <div className='p-6 rounded-md 
            bg-neutral-50/10
            h-fit w-full max-w-sm'>
            <SignUpForm />
        </div>
    );
};

export default page;