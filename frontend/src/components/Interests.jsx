import WeeklyBest from './WeeklyBest';
import Forum from './Forum';

function Extra() {
    return (
        <div className="container py-5">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-20">
                    <div className="col-span-1 md:col-span-2">
                        <WeeklyBest />
                    </div>
                    <div className="col-span-1">
                        <Forum />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Extra;
