import EventEditor from "../components/EventEditor"

const NewEventPage = () => {
    return (
        <div className="flex justify-center items-center mt-8">
            <div className="w-full max-w-6xl p-4 md:flex md:space-x-6">
                <div className="md:w-2/3">
                    <EventEditor />
                </div>
                <p className="text-gray-200 text-lg md:w-1/3 hidden md:block">
                    Welcome to our event creation page! With our streamlined form, you can quickly set up any event, be it a small gathering or a large school function.<br/><br/>Give your event a name, write a captivating description, and add relevant categories to help attendees know what to expect. Setting up the timing is a breeze with our date and time pickers. And of course, location is key! Make sure to pin the exact spot on the map, so attendees don't get lost.<br/><br/>Last but not least, provide an eye-catching image to draw attention to your event. Once everything is in place, simply hit 'Submit'. Happy event planning!
                </p>
            </div>
        </div>
    )
}

export default NewEventPage
