<?php namespace Drafterbit\Component\Session;

use Symfony\Component\HttpFoundation\Session\Storage\SessionStorageInterface;
use Symfony\Component\HttpFoundation\Session\Storage\MetadataBag;
use Symfony\Component\HttpFoundation\Session\SessionBagInterface;
use Drafterbit\Component\Encryption\Encrypter;

class CustomSessionStorage implements SessionStorageInterface
{
    /**
     * The session ID.
     *
     * @var string
     */
    protected $id;

    /**
     * The session name.
     *
     * @var string
     */
    protected $name;

    /**
     * Array of SessionBagInterface
     *
     * @var SessionBagInterface[]
     */
    protected $bags;

    /**
     * Array of session data
     *
     * @var array
     */
    protected $data = [];

    /**
     * @var bool
     */
    protected $started = false;

    /**
     * @var bool
     */
    protected $closed = false;

    /**
     * @var AbstractProxy
     */
    protected $handler;

    /**
     * @var \Drafterbit\Component\Encryption\Encrypter
     */
    protected $encrypter;

    /**
     * @var MetadataBag
     */
    protected $metaBag;

    /**
     * Create a new session instance.
     *
     * @param  string  $name
     * @param  \SessionHandlerInterface  $handler
     * @param  string|null $id
     * @return void
     */
    public function __construct($name, \SessionHandlerInterface $handler, Encrypter $encrypter = null,  MetadataBag $metaBag = null)
    {
        $this->name = $name;
        $this->handler = $handler;
        $this->encrypter = $encrypter;
        $this->setMetadataBag($metaBag);
    }

    /**
     * Gets the save handler instance.
     *
     * @return AbstractProxy
     */
    public function getHandler()
    {
        return $this->handler;
    }

    /**
     * {@inheritdoc}
     */
    public function start()
    {
        $this->loadSession();
        return $this->started = true;
    }

    /**
     * {@inheritdoc}
     */
    public function isStarted()
    {
        return $this->started;
    }

    /**
     * {@inheritdoc}
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * {@inheritdoc}
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * {@inheritdoc}
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * {@inheritdoc}
     */
    public function regenerate($destroy = false, $lifetime = null)
    {
        return $this->migrate($destroy);
    }

    /**
     * {@inheritdoc}
     */
    public function save()
    {
        $this->handler->write($this->getId(), $this->encrypter->encrypt(serialize($this->data)));
        $this->started = false;
    }

    /**
     * {@inheritdoc}
     */
    public function clear()
    {
        // clear out the bags
        foreach ($this->bags as $bag) {
            $bag->clear();
        }

        $this->handler->destroy($this->getId());
    }

    /**
     * {@inheritdoc}
     */
    public function registerBag(SessionBagInterface $bag)
    {
        $this->bags[$bag->getName()] = $bag;
    }

    /**
     * {@inheritdoc}
     */
    public function getBag($name)
    {
        if (!isset($this->bags[$name])) {
            throw new \InvalidArgumentException(sprintf('The SessionBagInterface %s is not registered.', $name));
        }

        return $this->bags[$name];
    }

    /**
     * Sets the MetadataBag.
     *
     * @param MetadataBag $metaBag
     */
    public function setMetadataBag(MetadataBag $metaBag = null)
    {
        if (null === $metaBag) {
            $metaBag = new MetadataBag();
        }

        $this->metaBag = $metaBag;
    }

    /**
     * Gets the MetadataBag.
     *
     * @return MetadataBag
     */
    public function getMetadataBag()
    {
        return $this->metaBag;
    }

    /**
     * Registers session handler.
     *
     * @param AbstractProxy|\SessionHandlerInterface|null $handler
     *
     * @throws \InvalidArgumentException
     */
    public function setHandler($handler = null)
    {
        $this->handler = $handler;
    }

    /**
     * {@inheritdoc}
     */
    public function migrate($destroy = false, $lifetime = null)
    {
        if ($destroy) $this->handler->destroy($this->getId());

        $this->id = $this->generateSessionId(); return true;
    }

     /**
     * Load the session with attributes.
     *
     * After starting the session, PHP retrieves the session from whatever handlers
     * are set to (either PHP's internal, or a custom save handler set with session_set_save_handler()).
     * PHP takes the return value from the read() handler, unserializes it
     * and populates $_SESSION with the result automatically.
     *
     * @param array|null $session
     */
    protected function loadSession()
    {
        $this->data = $this->readHandler();

        $bags = array_merge($this->bags, [$this->metaBag]);

        foreach ($bags as $bag) {
            $key = $bag->getStorageKey();
            $this->data[$key] = isset($this->data[$key]) ? $this->data[$key] : [];
            $bag->initialize($this->data[$key]);
        }

        $this->started = true;
        $this->closed = false;
    }

    /**
     * Read the session data from the handler.
     *
     * @return array
     */
    protected function readHandler()
    {
        $data = $this->handler->read($this->getId());
        return $data ? unserialize($this->encrypter->decrypt($data)) : [];
    }

    /**
     * Get a new, random session ID.
     *
     * @return string
     */
    protected function generateSessionId()
    {
        return sha1(uniqid(true).str_random(25).microtime(true));
    }
}