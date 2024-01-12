import React, { useState } from 'react'
import { getPrototypeByID } from 'query/prototype/prototype.query'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import PrototypeBlindStructure from 'shared/components/PrototypeBlindStructure'
import PrototypePrizeStructure from 'shared/components/PrototypePrizeStructure'
import ViewBasicPrototype from 'shared/components/ViewBasicPrototype'
import Wrapper from 'shared/components/Wrap'

const ViewPrototype = () => {
    const { id } = useParams()

    const [buttonToggle, setButtonToggle] = useState({
        basicView: true,
        blindStructure: false,
        prizeStructure: false,
    })

    // GET SPECIFIC PROTOTYPE
    const { data: specificPrototype } = useQuery('prototypeDataById', () => getPrototypeByID(id), {
        enabled: !!id,
        select: (data) => data?.data?.data,
    })
    return (
        <Wrapper>
            <h3 className='view-header'>Prototype Information</h3><hr />
            <div className='prototype-button-group'>
                <button className={buttonToggle?.basicView && 'userActive'} onClick={() => setButtonToggle({ basicView: true })}>
                    Basic View
                </button>
                <button className={buttonToggle?.blindStructure && 'userActive'} onClick={() => setButtonToggle({ blindStructure: true })}>
                    Blind Structure
                </button>
                <button className={buttonToggle?.prizeStructure && 'userActive'} onClick={() => setButtonToggle({ prizeStructure: true })}>
                    Prize Structure
                </button>
            </div>

            <div className='prototype-header-contain'>
                {buttonToggle?.basicView && <ViewBasicPrototype id={id} data={specificPrototype} />}
                {buttonToggle?.blindStructure && <PrototypeBlindStructure id={id} data={specificPrototype} />}
                {buttonToggle?.prizeStructure && <PrototypePrizeStructure id={id} data={specificPrototype} />}
            </div>
        </Wrapper>
    )
}

export default ViewPrototype
