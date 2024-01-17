import {AnimatePresence, motion} from 'framer-motion';

const AnimationWrapper = ({children, keyValue, initial = {opacity: 0}, animate = {opacity: 1}, transition = {duration: 1}, classname}) => {
	return (
		<AnimatePresence>
			<motion.div key={keyValue} initial={initial} animate={animate} transition={transition} className={classname} >{children}</motion.div>
		</AnimatePresence>
	)
}

export default AnimationWrapper;