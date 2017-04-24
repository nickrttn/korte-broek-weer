--potmeter
potmeter = adc.read(0)

 function readPotValue ()
    local i = 1
    while potmeter do
    potmeter = adc.read(0)
        print(potmeter)
      i = i + 1
    end
 end

readPotValue ()
